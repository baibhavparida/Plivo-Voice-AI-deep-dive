/**
 * Voice AI Repository - TypeScript Type Definitions
 *
 * This file contains all the core type definitions used throughout
 * the Voice AI documentation repository.
 */

// ============================================
// Topic Types
// ============================================

/**
 * Represents a documentation topic/article
 */
export interface Topic {
  /** Unique identifier for the topic */
  id: string;

  /** Display title of the topic */
  title: string;

  /** URL-friendly slug for routing */
  slug: string;

  /** Brief description of the topic content */
  description: string;

  /** Parent topic ID for hierarchical organization (null for root topics) */
  parentId: string | null;

  /** Sort order within the same hierarchy level */
  order: number;

  /** Array of tags for categorization and search */
  tags: string[];

  /** The actual content (MDX/Markdown) of the topic */
  content: string;

  /** Optional icon identifier for navigation display */
  icon?: string;

  /** Whether this topic is published/visible */
  isPublished?: boolean;

  /** Creation timestamp */
  createdAt?: string;

  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * Minimal topic reference used in related topics
 */
export interface TopicReference {
  id: string;
  title: string;
  slug: string;
}

// ============================================
// Navigation Types
// ============================================

/**
 * Navigation item that extends Topic with nested children
 * Used for building the sidebar navigation tree
 */
export interface NavigationItem {
  /** The topic data */
  topic: Topic;

  /** Nested child navigation items */
  children: NavigationItem[];

  /** Whether this navigation item is currently expanded */
  isExpanded?: boolean;

  /** Whether this is the currently active/selected item */
  isActive?: boolean;

  /** Depth level in the navigation tree (0 = root) */
  depth?: number;
}

/**
 * Navigation section for grouping related topics
 */
export interface NavigationSection {
  /** Section title (e.g., "Getting Started", "Core Concepts") */
  title: string;

  /** URL-friendly identifier */
  slug: string;

  /** Navigation items within this section */
  items: NavigationItem[];

  /** Optional icon for the section */
  icon?: string;

  /** Whether this section is collapsible */
  collapsible?: boolean;

  /** Default expanded state */
  defaultExpanded?: boolean;
}

/**
 * Complete navigation structure for the documentation
 */
export interface NavigationStructure {
  /** Array of navigation sections */
  sections: NavigationSection[];

  /** Flat map of all topics by slug for quick lookup */
  topicMap: Record<string, Topic>;
}

// ============================================
// Table of Contents Types
// ============================================

/**
 * Represents a single item in the table of contents
 * Generated from headings in the content
 */
export interface TableOfContentsItem {
  /** Unique identifier (usually derived from heading text) */
  id: string;

  /** The heading text */
  text: string;

  /** Heading level (1-6, corresponding to h1-h6) */
  level: number;

  /** Nested items under this heading */
  children?: TableOfContentsItem[];
}

/**
 * Complete table of contents for a page
 */
export interface TableOfContents {
  /** Array of top-level TOC items */
  items: TableOfContentsItem[];

  /** Minimum heading level included (default: 2) */
  minLevel?: number;

  /** Maximum heading level included (default: 4) */
  maxLevel?: number;
}

// ============================================
// Frontmatter Types
// ============================================

/**
 * MDX/Markdown frontmatter metadata
 */
export interface Frontmatter {
  /** Page title */
  title: string;

  /** Meta description for SEO */
  description: string;

  /** Category for organization */
  category: string;

  /** Array of tags for categorization */
  tags: string[];

  /** Array of related topic slugs */
  related: string[];

  /** Last updated date (ISO string) */
  lastUpdated: string;

  /** Author name or identifier */
  author?: string;

  /** Estimated reading time in minutes */
  readingTime?: number;

  /** Whether this is a draft (not published) */
  draft?: boolean;

  /** Custom canonical URL */
  canonicalUrl?: string;

  /** Open Graph image URL */
  ogImage?: string;

  /** Topic difficulty level */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';

  /** Prerequisites (slugs of topics that should be read first) */
  prerequisites?: string[];

  /** Order/priority for sorting */
  order?: number;
}

/**
 * Parsed MDX content with frontmatter
 */
export interface ParsedContent {
  /** Extracted frontmatter data */
  frontmatter: Frontmatter;

  /** The content without frontmatter */
  content: string;

  /** Generated table of contents */
  tableOfContents: TableOfContents;

  /** Extracted code blocks for syntax highlighting */
  codeBlocks?: CodeBlock[];
}

// ============================================
// Search Types
// ============================================

/**
 * Search result item
 */
export interface SearchResult {
  /** The matched topic */
  topic: Topic;

  /** Excerpt showing the matched content with context */
  excerpt: string;

  /** Relevance score (higher = more relevant) */
  score: number;

  /** Matched terms for highlighting */
  matchedTerms?: string[];

  /** Type of match (title, content, tags) */
  matchType?: 'title' | 'content' | 'tags' | 'description';

  /** Position of match in content (for jumping to location) */
  matchPosition?: number;
}

/**
 * Search query parameters
 */
export interface SearchQuery {
  /** The search term */
  query: string;

  /** Optional category filter */
  category?: string;

  /** Optional tag filters */
  tags?: string[];

  /** Maximum number of results */
  limit?: number;

  /** Offset for pagination */
  offset?: number;

  /** Sort order */
  sortBy?: 'relevance' | 'date' | 'title';
}

/**
 * Search response with pagination info
 */
export interface SearchResponse {
  /** Array of search results */
  results: SearchResult[];

  /** Total number of matches */
  totalResults: number;

  /** Current page */
  page: number;

  /** Total pages */
  totalPages: number;

  /** Time taken to search (ms) */
  searchTime: number;

  /** Query that was executed */
  query: SearchQuery;
}

/**
 * Search index entry for fast searching
 */
export interface SearchIndexEntry {
  /** Topic slug */
  slug: string;

  /** Searchable title (lowercased, normalized) */
  title: string;

  /** Searchable content (lowercased, normalized) */
  content: string;

  /** Searchable tags */
  tags: string[];

  /** Searchable description */
  description: string;

  /** Category for filtering */
  category: string;

  /** Last updated for sorting */
  lastUpdated: string;
}

// ============================================
// Code Block Types
// ============================================

/**
 * Represents a code block in content
 */
export interface CodeBlock {
  /** Programming language */
  language: string;

  /** The code content */
  code: string;

  /** Optional filename to display */
  filename?: string;

  /** Lines to highlight */
  highlightLines?: number[];

  /** Whether to show line numbers */
  showLineNumbers?: boolean;

  /** Caption or description */
  caption?: string;
}

// ============================================
// Component Props Types
// ============================================

/**
 * Props for the Sidebar component
 */
export interface SidebarProps {
  navigation: NavigationStructure;
  currentSlug?: string;
  onNavigate?: (slug: string) => void;
  className?: string;
}

/**
 * Props for the TableOfContents component
 */
export interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeId?: string;
  className?: string;
}

/**
 * Props for the SearchModal component
 */
export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (result: SearchResult) => void;
}

/**
 * Props for the TopicCard component
 */
export interface TopicCardProps {
  topic: Topic;
  variant?: 'default' | 'compact' | 'featured';
  showTags?: boolean;
  showDescription?: boolean;
  className?: string;
}

/**
 * Props for the CodeBlock component
 */
export interface CodeBlockProps extends CodeBlock {
  className?: string;
  copyable?: boolean;
}

// ============================================
// API Response Types
// ============================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

/**
 * API error structure
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * API response metadata
 */
export interface ApiMeta {
  timestamp: string;
  requestId?: string;
  pagination?: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============================================
// Theme Types
// ============================================

/**
 * Theme configuration
 */
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  codeTheme?: 'catppuccin-latte' | 'catppuccin-mocha';
}

// ============================================
// Utility Types
// ============================================

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Extract the element type from an array type
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Deep partial type
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Non-nullable version of a type
 */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
