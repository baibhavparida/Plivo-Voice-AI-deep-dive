import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';
import readingTime from 'reading-time';
import type { Frontmatter, TableOfContentsItem, Topic } from '@/lib/types';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Import taxonomy data
import taxonomy from '@/lib/data/taxonomy.json';

// Content directory path
const CONTENT_DIR = path.join(process.cwd(), 'content');

/**
 * Category type from taxonomy
 */
interface TaxonomyCategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  parentId: string | null;
  order: number;
  tags: string[];
  icon?: string;
}

/**
 * Get a topic by its slug path
 * @param slugPath - Array of slug segments (e.g., ['foundations', 'speech-recognition'])
 */
export async function getTopicBySlug(slugPath: string[]): Promise<{
  frontmatter: Frontmatter;
  content: string;
  tableOfContents: TableOfContentsItem[];
  readingTime: string;
  source: MDXRemoteSerializeResult;
} | null> {
  const fullPath = path.join(CONTENT_DIR, ...slugPath) + '.mdx';

  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    // Try index.mdx for directory pages
    const indexPath = path.join(CONTENT_DIR, ...slugPath, 'index.mdx');
    if (!fs.existsSync(indexPath)) {
      return null;
    }
    return getTopicContent(indexPath);
  }

  return getTopicContent(fullPath);
}

/**
 * Load and parse MDX content from a file path
 */
async function getTopicContent(filePath: string): Promise<{
  frontmatter: Frontmatter;
  content: string;
  tableOfContents: TableOfContentsItem[];
  readingTime: string;
  source: MDXRemoteSerializeResult;
}> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Calculate reading time
  const stats = readingTime(content);

  // Extract table of contents
  const tableOfContents = extractTableOfContents(content);

  // Serialize MDX content (for client-side rendering)
  const source = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['anchor-link'],
            },
          },
        ],
        [rehypePrismPlus, { ignoreMissing: true }],
      ],
    },
  });

  return {
    frontmatter: data as Frontmatter,
    content,
    tableOfContents,
    readingTime: stats.text,
    source,
  };
}

/**
 * Strip markdown link syntax and keep only the link text
 * e.g., "[STT Overview](/topics/path)" becomes "STT Overview"
 */
function stripMarkdownLinks(text: string): string {
  // Match markdown links: [text](url) and replace with just text
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

/**
 * Extract table of contents from markdown content
 */
export function extractTableOfContents(content: string): TableOfContentsItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items: TableOfContentsItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    // Strip markdown links from heading text
    const rawText = match[2].trim();
    const text = stripMarkdownLinks(rawText);

    // Generate ID from cleaned text (same logic as rehype-slug)
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    items.push({
      id,
      text,
      level,
    });
  }

  return items;
}

/**
 * Get all topics from taxonomy
 */
export function getAllTopics(): Topic[] {
  const categories = taxonomy.categories as TaxonomyCategory[];

  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    slug: category.slug,
    description: category.description,
    parentId: category.parentId,
    order: category.order,
    tags: category.tags,
    content: '', // Content loaded separately
    icon: category.icon,
  }));
}

/**
 * Get all topic slugs for static generation
 */
export function getAllTopicSlugs(): string[][] {
  const categories = taxonomy.categories as TaxonomyCategory[];
  const slugs: string[][] = [];

  // Build slug paths for each category
  const categoryMap = new Map<string, TaxonomyCategory>();
  categories.forEach((cat) => categoryMap.set(cat.id, cat));

  categories.forEach((category) => {
    const slugPath: string[] = [];
    let current: TaxonomyCategory | undefined = category;

    // Build path from current to root
    while (current) {
      slugPath.unshift(current.slug);
      current = current.parentId
        ? categoryMap.get(current.parentId)
        : undefined;
    }

    slugs.push(slugPath);
  });

  return slugs;
}

/**
 * Get navigation tree for sidebar
 */
export function getNavigationTree(): Array<{
  title: string;
  href: string;
  children: Array<{
    title: string;
    href: string;
    children: Array<{
      title: string;
      href: string;
    }>;
  }>;
}> {
  const categories = taxonomy.categories as TaxonomyCategory[];
  const categoryMap = new Map<string, TaxonomyCategory>();
  const childrenMap = new Map<string | null, TaxonomyCategory[]>();

  // Index categories
  categories.forEach((cat) => {
    categoryMap.set(cat.id, cat);
    const parentId = cat.parentId;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(cat);
  });

  // Define nav item type
  interface NavItem {
    title: string;
    href: string;
    children: NavItem[];
  }

  // Build tree recursively
  const buildTree = (parentId: string | null, basePath: string = '/topics'): NavItem[] => {
    const children: TaxonomyCategory[] = childrenMap.get(parentId) || [];
    return children
      .sort((a, b) => a.order - b.order)
      .map((cat): NavItem => ({
        title: cat.title,
        href: `${basePath}/${cat.slug}`,
        children: buildTree(cat.id, `${basePath}/${cat.slug}`),
      }));
  };

  return buildTree(null);
}

/**
 * Get topic metadata by slug path
 */
export function getTopicMetadata(
  slugPath: string[]
): {
  title: string;
  description: string;
  tags: string[];
  icon?: string;
} | null {
  return findTopicBySlugPath(slugPath);
}

/**
 * Find topic by slug path
 */
function findTopicBySlugPath(
  slugPath: string[]
): TaxonomyCategory | null {
  const categories = taxonomy.categories as TaxonomyCategory[];
  const categoryMap = new Map<string, TaxonomyCategory>();
  const childrenMap = new Map<string | null, TaxonomyCategory[]>();

  // Index categories
  categories.forEach((cat) => {
    categoryMap.set(cat.id, cat);
    const parentId = cat.parentId;
    if (!childrenMap.has(parentId)) {
      childrenMap.set(parentId, []);
    }
    childrenMap.get(parentId)!.push(cat);
  });

  // Navigate through the path
  let parentId: string | null = null;

  for (const slug of slugPath) {
    const children: TaxonomyCategory[] = childrenMap.get(parentId) || [];
    const found = children.find((c) => c.slug === slug);
    if (!found) {
      return null;
    }
    parentId = found.id;
  }

  // Return the final category
  if (parentId) {
    return categoryMap.get(parentId) || null;
  }

  return null;
}

/**
 * Get previous and next topics for navigation
 */
export function getPrevNextTopics(slugPath: string[]): {
  prev: { title: string; href: string } | null;
  next: { title: string; href: string } | null;
} {
  const allSlugs = getAllTopicSlugs();
  const currentSlugStr = slugPath.join('/');

  // Find current index
  const currentIndex = allSlugs.findIndex(
    (s) => s.join('/') === currentSlugStr
  );

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  // Get prev and next
  const prevSlug = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  const getTopicInfo = (slug: string[] | null) => {
    if (!slug) return null;
    const meta = getTopicMetadata(slug);
    if (!meta) return null;
    return {
      title: meta.title,
      href: '/topics/' + slug.join('/'),
    };
  };

  return {
    prev: getTopicInfo(prevSlug),
    next: getTopicInfo(nextSlug),
  };
}

/**
 * Search topics by query
 */
export function searchTopics(query: string): Topic[] {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase();
  const allTopics = getAllTopics();

  return allTopics
    .filter(
      (topic) =>
        topic.title.toLowerCase().includes(queryLower) ||
        topic.description.toLowerCase().includes(queryLower) ||
        topic.tags.some((tag) => tag.toLowerCase().includes(queryLower))
    )
    .slice(0, 20); // Limit results
}

/**
 * Get topics by category/parent
 */
export function getTopicsByParent(parentId: string | null): Topic[] {
  const allTopics = getAllTopics();
  return allTopics
    .filter((topic) => topic.parentId === parentId)
    .sort((a, b) => a.order - b.order);
}
