'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { clsx } from 'clsx';
import type { BreadcrumbItem } from '@/types/navigation';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {/* Home link */}
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.href || item.label} className="flex items-center gap-1.5">
              <ChevronRight
                className="h-4 w-4 text-neutral-400 dark:text-neutral-600"
                aria-hidden="true"
              />
              {isLast || !item.href ? (
                <span
                  className={clsx('font-medium', {
                    'text-neutral-900 dark:text-neutral-100': isLast,
                    'text-neutral-500 dark:text-neutral-400': !isLast,
                  })}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
