'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

// Import taxonomy data
import taxonomy from '@/lib/data/taxonomy.json';

interface Category {
  id: string;
  title: string;
  slug: string;
  description: string;
  parentId: string | null;
  order: number;
  tags: string[];
  icon?: string;
}

interface SearchResult extends Category {
  href: string;
  matchType: 'title' | 'description' | 'tags';
  parentTitle?: string;
}

// Build href from category by traversing parent chain
function buildHref(
  category: Category,
  categoryMap: Map<string, Category>
): string {
  const pathSegments: string[] = [];
  let current: Category | undefined = category;

  while (current) {
    pathSegments.unshift(current.slug);
    if (current.parentId) {
      current = categoryMap.get(current.parentId);
    } else {
      current = undefined;
    }
  }

  return '/topics/' + pathSegments.join('/');
}

// Get parent title
function getParentTitle(
  category: Category,
  categoryMap: Map<string, Category>
): string | undefined {
  if (!category.parentId) return undefined;
  const parent = categoryMap.get(category.parentId);
  return parent?.title;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Build category map once
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    (taxonomy.categories as Category[]).forEach((cat) => map.set(cat.id, cat));
    return map;
  }, []);

  // All searchable items
  const allItems = useMemo(() => {
    return (taxonomy.categories as Category[]).map((cat) => ({
      ...cat,
      href: buildHref(cat, categoryMap),
      parentTitle: getParentTitle(cat, categoryMap),
    }));
  }, [categoryMap]);

  // Search function
  const search = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setSelectedIndex(-1);
        return;
      }

      const queryLower = searchQuery.toLowerCase();
      const matches: SearchResult[] = [];

      allItems.forEach((item) => {
        let matchType: 'title' | 'description' | 'tags' | null = null;

        if (item.title.toLowerCase().includes(queryLower)) {
          matchType = 'title';
        } else if (item.description.toLowerCase().includes(queryLower)) {
          matchType = 'description';
        } else if (item.tags.some((tag) => tag.toLowerCase().includes(queryLower))) {
          matchType = 'tags';
        }

        if (matchType) {
          matches.push({
            ...item,
            matchType,
          });
        }
      });

      // Sort: title matches first, then by order
      matches.sort((a, b) => {
        if (a.matchType === 'title' && b.matchType !== 'title') return -1;
        if (a.matchType !== 'title' && b.matchType === 'title') return 1;
        return a.order - b.order;
      });

      setResults(matches.slice(0, 8));
      setSelectedIndex(-1);
    },
    [allItems]
  );

  // Handle query changes
  useEffect(() => {
    search(query);
  }, [query, search]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          router.push(results[selectedIndex].href);
          setIsOpen(false);
          setQuery('');
        } else if (query.trim()) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [results, selectedIndex, router, query]
  );

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center">
          {/* Title - matches sidebar width + gap (w-52 + gap-16 = 13rem + 4rem) */}
          <div className="hidden lg:flex items-center w-[17rem] flex-shrink-0">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 whitespace-nowrap">
              Voice AI Deep Dives
            </span>
          </div>

          <div ref={containerRef} className="relative w-full max-w-md">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              placeholder="Search documentation..."
              className="w-full pl-12 pr-10 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400/20 transition-all text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
              aria-label="Search documentation"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isOpen && query && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg overflow-hidden z-50">
              {results.length > 0 ? (
                <>
                  <div className="max-h-80 overflow-y-auto">
                    {results.map((result, index) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={handleResultClick}
                        className={clsx(
                          'flex items-start gap-3 px-4 py-3 transition-colors',
                          index === selectedIndex
                            ? 'bg-neutral-100 dark:bg-neutral-700'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                        )}
                      >
                        <BookOpen
                          className={clsx(
                            'h-5 w-5 mt-0.5 flex-shrink-0',
                            index === selectedIndex
                              ? 'text-neutral-900 dark:text-white'
                              : 'text-neutral-400'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={clsx(
                                'font-medium text-sm',
                                index === selectedIndex
                                  ? 'text-neutral-900 dark:text-white'
                                  : 'text-neutral-900 dark:text-white'
                              )}
                            >
                              {result.title}
                            </span>
                            {result.parentTitle && (
                              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                in {result.parentTitle}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight
                          className={clsx(
                            'h-4 w-4 mt-1 flex-shrink-0',
                            index === selectedIndex
                              ? 'text-neutral-900 dark:text-white'
                              : 'text-neutral-300 dark:text-neutral-600'
                          )}
                        />
                      </Link>
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-700/50 border-t border-neutral-200 dark:border-neutral-700">
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                    >
                      <Search className="h-4 w-4" />
                      <span>View all results for &quot;{query}&quot;</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    No results found for &quot;{query}&quot;
                  </p>
                  <Link
                    href="/search"
                    onClick={handleResultClick}
                    className="mt-2 inline-flex items-center gap-1 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                  >
                    <span>Browse all topics</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
