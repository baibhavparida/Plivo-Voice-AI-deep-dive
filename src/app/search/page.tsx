'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  ArrowRight,
  Layers,
  Server,
  Brain,
  Briefcase,
  BookOpen,
  Code,
  Home,
  GitBranch,
  Building,
} from 'lucide-react';
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

// Icon mapping for categories
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  layers: Layers,
  server: Server,
  brain: Brain,
  briefcase: Briefcase,
  'book-open': BookOpen,
  code: Code,
  'git-branch': GitBranch,
  building: Building,
};

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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
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

  // Group results by parent category
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};

    results.forEach((result) => {
      // Find root parent
      let rootId = result.id;
      let current: Category | undefined = categoryMap.get(result.id);
      while (current?.parentId) {
        rootId = current.parentId;
        current = categoryMap.get(current.parentId);
      }

      const rootCategory = categoryMap.get(rootId);
      const groupName = rootCategory?.title || 'Other';

      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(result);
    });

    return groups;
  }, [results, categoryMap]);

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

      setResults(matches.slice(0, 20));
      setSelectedIndex(-1);
    },
    [allItems]
  );

  // Handle query changes
  useEffect(() => {
    search(query);
  }, [query, search]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setQuery('');
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, router]);

  // Flatten grouped results for index calculation
  const flatResults = useMemo(() => {
    const flat: SearchResult[] = [];
    Object.values(groupedResults).forEach((group) => {
      flat.push(...group);
    });
    return flat;
  }, [groupedResults]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Search Documentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Find topics, guides, and resources across the Voice AI Repository
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for topics, concepts, or tags..."
              className="w-full pl-14 pr-14 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:outline-none focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all"
              aria-label="Search documentation"
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Keyboard hint */}
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                Cmd + K
              </kbd>
              <span>to search anywhere</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                Enter
              </kbd>
              <span>to select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                Esc
              </kbd>
              <span>to clear</span>
            </span>
          </div>
        </div>

        {/* Results */}
        {query ? (
          <div className="space-y-8">
            {results.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}{' '}
                  for &quot;{query}&quot;
                </p>

                {/* Grouped Results */}
                {Object.entries(groupedResults).map(([groupName, items]) => (
                  <div key={groupName}>
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      {groupName}
                    </h2>
                    <div className="space-y-2">
                      {items.map((result) => {
                        const globalIndex = flatResults.findIndex(
                          (r) => r.id === result.id
                        );
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = result.icon
                          ? iconMap[result.icon]
                          : BookOpen;

                        return (
                          <Link
                            key={result.id}
                            href={result.href}
                            className={clsx(
                              'group flex items-start gap-4 p-4 rounded-xl border transition-all',
                              isSelected
                                ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md'
                            )}
                          >
                            <div
                              className={clsx(
                                'flex-shrink-0 p-2 rounded-lg',
                                isSelected
                                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                              )}
                            >
                              {Icon && <Icon className="h-5 w-5" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3
                                  className={clsx(
                                    'font-semibold',
                                    isSelected
                                      ? 'text-primary-700 dark:text-primary-300'
                                      : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
                                  )}
                                >
                                  {result.title}
                                </h3>
                                {result.parentTitle && (
                                  <span className="text-xs text-gray-400 dark:text-gray-500">
                                    in {result.parentTitle}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {result.description}
                              </p>
                              {result.matchType === 'tags' && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {result.tags
                                    .filter((tag) =>
                                      tag
                                        .toLowerCase()
                                        .includes(query.toLowerCase())
                                    )
                                    .slice(0, 3)
                                    .map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>

                            <ArrowRight
                              className={clsx(
                                'flex-shrink-0 h-5 w-5 mt-1 transition-transform',
                                isSelected
                                  ? 'text-primary-600 dark:text-primary-400 translate-x-1'
                                  : 'text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1'
                              )}
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try searching for different keywords or browse the topics
                  below
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Popular Topics */
          <div className="space-y-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Popular Topics
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              {allItems
                .filter((item) => item.parentId === null)
                .slice(0, 6)
                .map((item) => {
                  const Icon = item.icon ? iconMap[item.icon] : BookOpen;

                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-md transition-all"
                    >
                      <div className="flex-shrink-0 p-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {Icon && <Icon className="h-6 w-6" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {item.description}
                        </p>
                      </div>
                      <ArrowRight className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                    </Link>
                  );
                })}
            </div>

            {/* Quick Access Tags */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Browse by Tag
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'speech-recognition',
                  'text-to-speech',
                  'llm',
                  'telephony',
                  'streaming',
                  'optimization',
                  'security',
                  'customer-service',
                  'healthcare',
                  'architecture',
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
