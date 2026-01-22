'use client';

import { useEffect, useState, useCallback } from 'react';
import { List } from 'lucide-react';
import { clsx } from 'clsx';
import type { TableOfContentsItem } from '@/types/navigation';

interface TableOfContentsProps {
  headings: TableOfContentsItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Flatten headings for scroll tracking
  const flattenHeadings = useCallback(
    (items: TableOfContentsItem[]): TableOfContentsItem[] => {
      return items.reduce<TableOfContentsItem[]>((acc, item) => {
        acc.push(item);
        if (item.children) {
          acc.push(...flattenHeadings(item.children));
        }
        return acc;
      }, []);
    },
    []
  );

  useEffect(() => {
    const flatHeadings = flattenHeadings(headings);
    const headingIds = flatHeadings.map((h) => h.id);

    if (headingIds.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0,
      }
    );

    headingIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      headingIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [headings, flattenHeadings]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActiveId(id);
        // Update URL hash without scrolling
        window.history.pushState(null, '', `#${id}`);
      }
    },
    []
  );

  if (!headings || headings.length === 0) {
    return null;
  }

  const renderHeading = (item: TableOfContentsItem, depth: number = 0) => {
    const isActive = activeId === item.id;

    return (
      <li key={item.id}>
        <a
          href={`#${item.id}`}
          onClick={(e) => handleClick(e, item.id)}
          className={clsx(
            'block py-1 text-sm leading-normal transition-colors',
            depth === 0 && 'pl-0',
            depth === 1 && 'pl-3',
            depth === 2 && 'pl-6',
            isActive
              ? 'text-gray-900 dark:text-white font-medium'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          {item.title}
        </a>
        {item.children && item.children.length > 0 && (
          <ul>
            {item.children.map((child) => renderHeading(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-52 shrink-0 overflow-y-auto py-6 xl:block">
      <nav aria-label="Table of contents">
        <div className="flex items-center gap-2 mb-3 text-xs font-medium text-gray-500 dark:text-gray-400">
          <List className="h-4 w-4" />
          <span>On this page</span>
        </div>
        <ul className="space-y-0.5">
          {headings.map((heading) => renderHeading(heading))}
        </ul>
      </nav>
    </aside>
  );
}
