import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getTopicBySlug,
  getAllTopicSlugs,
  getTopicMetadata,
  getNavigationTree,
  getPrevNextTopics,
} from '@/lib/mdx';
import TopicPageWrapper from './TopicPageWrapper';

// Force dynamic rendering to avoid SSR serialization issues
export const dynamic = 'force-dynamic';

interface TopicPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const meta = getTopicMetadata(slug);

  if (!meta) {
    return {
      title: 'Topic Not Found',
      description: 'The requested topic could not be found.',
    };
  }

  const path = '/topics/' + slug.join('/');

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      url: `https://voice-ai-repository.plivo.com${path}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `https://voice-ai-repository.plivo.com${path}`,
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;

  // Get topic metadata from taxonomy
  const topicMeta = getTopicMetadata(slug);

  if (!topicMeta) {
    notFound();
  }

  // Try to load MDX content
  let content = null;
  try {
    content = await getTopicBySlug(slug);
  } catch (error) {
    // MDX content not found, we'll show a placeholder
    console.error(`Error loading MDX content for ${slug.join('/')}:`, error);
  }

  // Get navigation tree
  const navigationTree = getNavigationTree();

  // Transform navigation tree to expected format
  const navigation = navigationTree.map((item) => ({
    label: item.title,
    href: item.href,
    children: item.children.map((child) => ({
      label: child.title,
      href: child.href,
      children: child.children.map((grandchild) => ({
        label: grandchild.title,
        href: grandchild.href,
      })),
    })),
  }));

  // Get prev/next navigation
  const prevNext = getPrevNextTopics(slug);

  // Build frontmatter from taxonomy or MDX
  const baseFrontmatter = content?.frontmatter || {
    title: topicMeta.title,
    description: topicMeta.description,
    category: slug[0],
  };

  const frontmatter = {
    ...baseFrontmatter,
    readingTime: content?.readingTime ? String(content.readingTime) : undefined,
  };

  // Build table of contents
  const tableOfContents = content?.tableOfContents?.map((item) => ({
    id: item.id,
    text: item.text,
    level: item.level,
  })) || [];

  // Serialize the MDX source to a plain object for client-side rendering
  const mdxSource = content?.source ? JSON.parse(JSON.stringify(content.source)) : null;

  return (
    <TopicPageWrapper
      frontmatter={{
        ...frontmatter,
        readingTime: frontmatter.readingTime?.toString(),
      }}
      tableOfContents={tableOfContents}
      navigation={navigation}
      prevNext={{
        prev: prevNext.prev
          ? { label: prevNext.prev.title, href: prevNext.prev.href }
          : undefined,
        next: prevNext.next
          ? { label: prevNext.next.title, href: prevNext.next.href }
          : undefined,
      }}
      topicMeta={topicMeta}
      mdxSource={mdxSource}
    />
  );
}
