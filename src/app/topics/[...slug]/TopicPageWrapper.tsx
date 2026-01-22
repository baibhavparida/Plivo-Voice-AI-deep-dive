'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Lazy load heavy components to avoid SSR issues
import dynamic from 'next/dynamic';

// Dynamically import TopicLayout to avoid SSR serialization issues
const TopicLayout = dynamic(
  () => import('@/components/layout/TopicLayout'),
  { ssr: false }
);

// MDXRemote will be imported dynamically in useEffect

interface Frontmatter {
  title: string;
  description?: string;
  category?: string;
  readingTime?: string;
  lastUpdated?: string;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

interface NavigationLinks {
  prev?: {
    label: string;
    href: string;
  };
  next?: {
    label: string;
    href: string;
  };
}

interface TopicMeta {
  title: string;
  description: string;
  tags: string[];
  icon?: string;
}

interface TopicPageWrapperProps {
  frontmatter: Frontmatter;
  tableOfContents: TOCItem[];
  navigation: NavItem[];
  prevNext: NavigationLinks;
  topicMeta: TopicMeta;
  mdxSource: MDXRemoteSerializeResult | null;
}

// Placeholder component when MDX content doesn't exist yet
function TopicPlaceholder({
  topic,
}: {
  topic: TopicMeta;
}) {
  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
        <h3 className="text-amber-800 dark:text-amber-200 mt-0 flex items-center gap-2">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Content Coming Soon
        </h3>
        <p className="text-amber-700 dark:text-amber-300 mb-0">
          This topic is part of our planned content. The detailed documentation
          for <strong>{topic.title}</strong> will be available soon.
        </p>
      </div>

      <h2>About This Topic</h2>
      <p>{topic.description}</p>

      <h3>Related Tags</h3>
      <div className="flex flex-wrap gap-2 not-prose">
        {topic.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <h3>Want to Contribute?</h3>
      <p>
        We welcome contributions to the Voice AI Repository. If you have
        expertise in this area and would like to help write this content, please
        visit our{' '}
        <Link
          href="https://github.com/plivo/voice-ai-repository"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub repository
        </Link>{' '}
        to get started.
      </p>
    </div>
  );
}

// Loading component
function TopicPageLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Left sidebar skeleton */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0 py-8">
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <main className="flex-1 min-w-0 py-8">
            {/* Breadcrumbs skeleton */}
            <div className="mb-6 flex items-center gap-2">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Header skeleton */}
            <header className="mb-8">
              <div className="h-6 w-24 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-3 animate-pulse" />
              <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="h-6 w-full max-w-2xl bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </header>

            {/* Content skeleton */}
            <article className="space-y-4">
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-4/5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-32 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mt-8" />
            </article>
          </main>

          {/* Right sidebar skeleton */}
          <div className="hidden xl:block w-56 flex-shrink-0 py-8">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  style={{ width: `${80 - i * 10}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TopicPageWrapper({
  frontmatter,
  tableOfContents,
  navigation,
  prevNext,
  topicMeta,
  mdxSource,
}: TopicPageWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [mdxComponents, setMdxComponents] = useState<Record<string, unknown> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MDXRemote, setMDXRemote] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    setMounted(true);
    // Dynamically import mdxComponents and MDXRemote on client side only
    Promise.all([
      import('@/components/MDXComponents'),
      import('next-mdx-remote'),
    ]).then(([componentsModule, mdxModule]) => {
      setMdxComponents(componentsModule.mdxComponents);
      setMDXRemote(() => mdxModule.MDXRemote);
    });
  }, []);

  // Show loading state during SSR and initial hydration
  if (!mounted) {
    return <TopicPageLoading />;
  }

  return (
    <TopicLayout
      frontmatter={frontmatter}
      tableOfContents={tableOfContents}
      navigation={navigation}
      prevNext={prevNext}
    >
      {mdxSource && mdxComponents && MDXRemote ? (
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <MDXRemote {...mdxSource} components={mdxComponents as any} />
        </div>
      ) : mdxSource ? (
        <TopicPageLoading />
      ) : (
        <TopicPlaceholder topic={topicMeta} />
      )}
    </TopicLayout>
  );
}
