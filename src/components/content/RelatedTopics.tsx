'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

interface RelatedTopic {
  title: string;
  description: string;
  href: string;
  category: string;
}

interface RelatedTopicsProps {
  topics: RelatedTopic[];
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  foundations: {
    bg: 'bg-neutral-100 dark:bg-neutral-900',
    text: 'text-neutral-700 dark:text-neutral-300',
    border: 'border-neutral-300 dark:border-neutral-700',
  },
  infrastructure: {
    bg: 'bg-neutral-100 dark:bg-neutral-900',
    text: 'text-neutral-700 dark:text-neutral-300',
    border: 'border-neutral-300 dark:border-neutral-700',
  },
  'llm-integration': {
    bg: 'bg-neutral-100 dark:bg-neutral-900',
    text: 'text-neutral-700 dark:text-neutral-300',
    border: 'border-neutral-300 dark:border-neutral-700',
  },
  'use-cases': {
    bg: 'bg-neutral-100 dark:bg-neutral-900',
    text: 'text-neutral-700 dark:text-neutral-300',
    border: 'border-neutral-300 dark:border-neutral-700',
  },
  resources: {
    bg: 'bg-neutral-100 dark:bg-neutral-900',
    text: 'text-neutral-700 dark:text-neutral-300',
    border: 'border-neutral-300 dark:border-neutral-700',
  },
};

function getCategoryStyle(category: string) {
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
  return (
    categoryColors[normalizedCategory] || {
      bg: 'bg-neutral-100 dark:bg-neutral-900',
      text: 'text-neutral-700 dark:text-neutral-300',
      border: 'border-neutral-300 dark:border-neutral-700',
    }
  );
}

function formatCategoryLabel(category: string): string {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function RelatedTopics({ topics }: RelatedTopicsProps) {
  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <section className="my-10" aria-labelledby="related-topics-heading">
      <h2
        id="related-topics-heading"
        className="mb-6 text-xl font-semibold text-black dark:text-white"
      >
        Related Topics
      </h2>

      <div
        className={clsx(
          'grid gap-4',
          topics.length === 1 && 'grid-cols-1',
          topics.length === 2 && 'grid-cols-1 sm:grid-cols-2',
          topics.length >= 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {topics.map((topic, index) => {
          const categoryStyle = getCategoryStyle(topic.category);

          return (
            <Link
              key={`${topic.href}-${index}`}
              href={topic.href}
              className={clsx(
                'group relative flex flex-col rounded-lg border p-5',
                'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
                'transition-all duration-200',
                'hover:border-black dark:hover:border-white hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2',
                'dark:focus-visible:ring-offset-black'
              )}
            >
              {/* Category badge */}
              <span
                className={clsx(
                  'mb-3 inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                  categoryStyle.bg,
                  categoryStyle.text,
                  'border',
                  categoryStyle.border
                )}
              >
                {formatCategoryLabel(topic.category)}
              </span>

              {/* Title */}
              <h3 className="mb-2 text-base font-semibold text-black dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                {topic.title}
              </h3>

              {/* Description */}
              <p className="mb-4 flex-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {topic.description}
              </p>

              {/* Arrow indicator */}
              <div className="flex items-center text-sm font-medium text-black dark:text-white">
                <span>Read more</span>
                <ArrowRight
                  className={clsx(
                    'ml-1.5 h-4 w-4 transition-transform duration-200',
                    'group-hover:translate-x-1'
                  )}
                  aria-hidden="true"
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
