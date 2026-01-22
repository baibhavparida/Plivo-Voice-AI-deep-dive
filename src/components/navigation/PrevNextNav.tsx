'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import type { PrevNextItem } from '@/types/navigation';

interface PrevNextNavProps {
  prev?: PrevNextItem | null;
  next?: PrevNextItem | null;
}

export default function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <nav
      aria-label="Previous and next articles"
      className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800 sm:flex-row sm:justify-between"
    >
      {prev ? (
        <Link
          href={prev.href}
          className={clsx(
            'group flex flex-1 flex-col rounded-lg border border-gray-200 p-4 transition-all duration-150',
            'hover:border-gray-400 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-900/50'
          )}
        >
          <span className="mb-1 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Previous
          </span>
          {prev.category && (
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              {prev.category}
            </span>
          )}
          <span className="mt-1 font-medium text-gray-900 dark:text-gray-100">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {next ? (
        <Link
          href={next.href}
          className={clsx(
            'group flex flex-1 flex-col rounded-lg border border-gray-200 p-4 text-right transition-all duration-150',
            'hover:border-gray-400 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-900/50'
          )}
        >
          <span className="mb-1 flex items-center justify-end gap-1 text-sm text-neutral-500 dark:text-neutral-400">
            Next
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          {next.category && (
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              {next.category}
            </span>
          )}
          <span className="mt-1 font-medium text-gray-900 dark:text-gray-100">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
