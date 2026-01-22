'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowRight,
  Menu,
  List,
} from 'lucide-react';
import { clsx } from 'clsx';

// Types
export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Frontmatter {
  title: string;
  description?: string;
  category?: string;
  readingTime?: string;
  lastUpdated?: string;
}

export interface NavigationLinks {
  prev?: {
    label: string;
    href: string;
  };
  next?: {
    label: string;
    href: string;
  };
}

interface TopicLayoutProps {
  children: React.ReactNode;
  frontmatter: Frontmatter;
  tableOfContents?: TOCItem[];
  navigation?: NavItem[];
  prevNext?: NavigationLinks;
}

// Recursive NavItem component for deep nesting
function NavItemComponent({
  item,
  level,
  pathname,
  onClose,
}: {
  item: NavItem;
  level: number;
  pathname: string;
  onClose: () => void;
}) {
  const isActive = (href: string) => pathname === href;

  const isAncestorActive = (navItem: NavItem): boolean => {
    if (pathname === navItem.href) return true;
    if (pathname.startsWith(navItem.href + '/')) return true;
    if (navItem.children) {
      return navItem.children.some((child) => isAncestorActive(child));
    }
    return false;
  };

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = isAncestorActive(item);
  const isCurrentPage = isActive(item.href);

  // Level 0 = top level categories
  // Level 1 = second level (e.g., Introduction, Why Voice AI Matters)
  // Level 2+ = deeper levels

  if (level === 0) {
    return (
      <li>
        <Link
          href={item.href}
          onClick={onClose}
          className={clsx(
            'flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            isExpanded
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          )}
        >
          <span>{item.label}</span>
          {hasChildren && (
            <ChevronDown
              className={clsx(
                'h-4 w-4 transition-transform',
                isExpanded ? 'rotate-0' : '-rotate-90'
              )}
              aria-hidden="true"
            />
          )}
        </Link>

        {hasChildren && isExpanded && (
          <ul className="mt-1 ml-3 space-y-1 border-l-2 border-neutral-200 dark:border-neutral-700">
            {item.children!.map((child) => (
              <NavItemComponent
                key={child.href}
                item={child}
                level={level + 1}
                pathname={pathname}
                onClose={onClose}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // Deeper levels
  return (
    <li>
      <Link
        href={item.href}
        onClick={onClose}
        className={clsx(
          'block py-1.5 text-sm rounded-r-lg transition-colors',
          level === 1 ? 'pl-4 pr-3' : `pl-${4 + (level - 1) * 3} pr-3`,
          isCurrentPage
            ? 'border-l-2 -ml-0.5 border-gray-900 dark:border-white text-gray-900 dark:text-white font-medium'
            : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
        )}
        style={{ paddingLeft: `${1 + level * 0.75}rem` }}
      >
        {item.label}
      </Link>

      {hasChildren && isExpanded && (
        <ul className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.href}
              item={child}
              level={level + 1}
              pathname={pathname}
              onClose={onClose}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// Sidebar navigation component
function Sidebar({
  navigation = [],
  isOpen,
  onClose,
}: {
  navigation: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-16 z-40 lg:z-0',
          'h-[calc(100vh-4rem)] w-72 lg:w-64',
          'bg-white dark:bg-neutral-900 lg:bg-transparent',
          'border-r border-neutral-200 dark:border-neutral-800 lg:border-0',
          'transform transition-transform duration-300 lg:transform-none',
          'overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="p-4 lg:p-0 lg:pr-4 lg:py-8" aria-label="Sidebar navigation">
          <ul className="space-y-1" role="list">
            {navigation.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                level={0}
                pathname={pathname}
                onClose={onClose}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

// Table of contents component
function TableOfContents({
  items = [],
  isOpen,
  onToggle,
}: {
  items: TOCItem[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track active heading with Intersection Observer
  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: '-80px 0px -80% 0px',
      threshold: 0,
    });

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    headings.forEach((heading) => {
      observerRef.current?.observe(heading);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Header height
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        // Update URL hash without scrolling
        history.pushState(null, '', `#${id}`);
        setActiveId(id);
      }
    },
    []
  );

  if (items.length === 0) return null;

  return (
    <div className="xl:sticky xl:top-24 xl:max-h-[calc(100vh-8rem)] xl:flex xl:flex-col">
      {/* Mobile TOC toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 w-full px-4 py-2 mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg xl:hidden"
        aria-expanded={isOpen}
        aria-controls="toc-content"
      >
        <List className="h-4 w-4" aria-hidden="true" />
        <span>On this page</span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 ml-auto transition-transform',
            isOpen ? 'rotate-180' : ''
          )}
          aria-hidden="true"
        />
      </button>

      {/* TOC content */}
      <nav
        id="toc-content"
        className={clsx(
          'xl:block xl:flex-1 xl:overflow-hidden xl:flex xl:flex-col',
          isOpen ? 'block' : 'hidden'
        )}
        aria-label="Table of contents"
      >
        <h2 className="hidden xl:block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3 flex-shrink-0">
          On this page
        </h2>
        <ul className="space-y-1 text-sm xl:overflow-y-auto xl:pr-2 scrollbar-thin" role="list">
          {items.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={clsx(
                  'block py-1 transition-colors',
                  activeId === item.id
                    ? 'text-neutral-900 dark:text-white font-semibold opacity-100'
                    : 'text-neutral-900 dark:text-neutral-100 opacity-60 hover:opacity-80'
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

// Breadcrumb component
function Breadcrumbs({ frontmatter }: { frontmatter: Frontmatter }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const label = isLast
      ? frontmatter.title
      : segment
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

    return { label, href, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
        <li>
          <Link
            href="/"
            className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            Home
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center gap-1">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            {crumb.isLast ? (
              <span className="text-neutral-900 dark:text-white font-medium">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Previous/Next navigation
function PrevNextNav({ links }: { links?: NavigationLinks }) {
  if (!links?.prev && !links?.next) return null;

  return (
    <nav
      className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800"
      aria-label="Previous and next pages"
    >
      <div className="flex items-center justify-between gap-4">
        {links.prev ? (
          <Link
            href={links.prev.href}
            className="group flex-1 flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <ChevronLeft
              className="h-5 w-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
              aria-hidden="true"
            />
            <div className="text-left">
              <span className="block text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">
                Previous
              </span>
              <span className="block text-sm font-medium text-gray-900 dark:text-white transition-colors">
                {links.prev.label}
              </span>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {links.next ? (
          <Link
            href={links.next.href}
            className="group flex-1 flex items-center justify-end gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            <div className="text-right">
              <span className="block text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">
                Next
              </span>
              <span className="block text-sm font-medium text-gray-900 dark:text-white transition-colors">
                {links.next.label}
              </span>
            </div>
            <ArrowRight
              className="h-5 w-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
              aria-hidden="true"
            />
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}

// Default navigation structure
const defaultNavigation: NavItem[] = [
  {
    label: 'Foundations',
    href: '/foundations',
    children: [
      { label: 'Introduction', href: '/foundations/introduction' },
      { label: 'Core Concepts', href: '/foundations/core-concepts' },
      { label: 'Voice Pipeline', href: '/foundations/voice-pipeline' },
      { label: 'Audio Fundamentals', href: '/foundations/audio-fundamentals' },
    ],
  },
  {
    label: 'Infrastructure',
    href: '/infrastructure',
    children: [
      { label: 'Architecture', href: '/infrastructure/architecture' },
      { label: 'Telephony', href: '/infrastructure/telephony' },
      { label: 'WebRTC', href: '/infrastructure/webrtc' },
      { label: 'Scaling', href: '/infrastructure/scaling' },
    ],
  },
  {
    label: 'LLM Integration',
    href: '/llm-integration',
    children: [
      { label: 'Overview', href: '/llm-integration/overview' },
      { label: 'Prompts', href: '/llm-integration/prompts' },
      { label: 'Streaming', href: '/llm-integration/streaming' },
      { label: 'Function Calling', href: '/llm-integration/function-calling' },
    ],
  },
  {
    label: 'Use Cases',
    href: '/use-cases',
    children: [
      { label: 'Customer Service', href: '/use-cases/customer-service' },
      { label: 'Sales', href: '/use-cases/sales' },
      { label: 'Healthcare', href: '/use-cases/healthcare' },
      { label: 'Education', href: '/use-cases/education' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Best Practices', href: '/resources/best-practices' },
      { label: 'Patterns', href: '/resources/architecture-patterns' },
      { label: 'Glossary', href: '/resources/glossary' },
      { label: 'FAQ', href: '/resources/faq' },
    ],
  },
];

// Main TopicLayout component
export default function TopicLayout({
  children,
  frontmatter,
  tableOfContents = [],
  navigation = defaultNavigation,
  prevNext,
}: TopicLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  // Close sidebar on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-12 lg:gap-16">
          {/* Left sidebar - aligned with logo */}
          <div className="hidden lg:block w-52 flex-shrink-0">
            <Sidebar
              navigation={navigation}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>

          {/* Mobile sidebar toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="fixed bottom-4 left-4 z-40 lg:hidden p-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            aria-label="Open sidebar navigation"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Mobile sidebar */}
          <div className="lg:hidden">
            <Sidebar
              navigation={navigation}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </div>

          {/* Main content */}
          <main className="flex-1 min-w-0 py-8">
            <Breadcrumbs frontmatter={frontmatter} />

            {/* Article metadata bar */}
            {(frontmatter.category || frontmatter.readingTime || frontmatter.lastUpdated) && (
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                {frontmatter.category && (
                  <span className="inline-block px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {frontmatter.category}
                  </span>
                )}
                {frontmatter.readingTime && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {frontmatter.readingTime}
                  </span>
                )}
                {frontmatter.lastUpdated && (
                  <span className="text-gray-500 dark:text-gray-400">
                    Updated {frontmatter.lastUpdated}
                  </span>
                )}
              </div>
            )}

            {/* Mobile TOC */}
            <div className="xl:hidden mb-8">
              <TableOfContents
                items={tableOfContents}
                isOpen={tocOpen}
                onToggle={() => setTocOpen(!tocOpen)}
              />
            </div>

            {/* Article content */}
            <article className="prose prose-gray dark:prose-invert max-w-none">
              {children}
            </article>

            {/* Previous/Next navigation */}
            <PrevNextNav links={prevNext} />
          </main>

          {/* Right sidebar - TOC - aligned with CTAs */}
          <div className="hidden xl:block w-56 flex-shrink-0">
            <div className="sticky top-24 py-8">
              <TableOfContents
                items={tableOfContents}
                isOpen={true}
                onToggle={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
