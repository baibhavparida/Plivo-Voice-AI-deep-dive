'use client';

import { useState, useRef, useCallback, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Copy,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { clsx } from 'clsx';

// Types
interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: string;
}

interface CalloutProps {
  children: ReactNode;
  type?: 'info' | 'warning' | 'danger' | 'success' | 'tip';
  title?: string;
}

interface DiagramProps {
  children: ReactNode;
  title?: string;
  caption?: string;
}

interface RelatedTopicsProps {
  topics: Array<{
    title: string;
    href: string;
    description?: string;
  }>;
}

interface TabContainerProps {
  children: ReactNode;
  tabs: string[];
  defaultTab?: number;
}

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

// CodeBlock Component
function CodeBlock({
  children,
  className,
  filename,
  showLineNumbers = false,
  highlightLines,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const copyToClipboard = useCallback(async () => {
    const code = codeRef.current?.textContent || '';
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  // Extract language from className (e.g., "language-typescript")
  const language = className?.replace('language-', '').replace('code-highlight', '').trim() || 'text';
  const displayLanguage = language || 'code';

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
      {/* Header with filename and language */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-sm text-neutral-600 dark:text-neutral-400">{filename}</span>
          )}
          {displayLanguage !== 'text' && (
            <span className="px-2 py-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 rounded">
              {displayLanguage}
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 rounded transition-colors"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre
        ref={codeRef}
        className={clsx(
          'overflow-x-auto p-4 text-sm m-0',
          'bg-neutral-50 dark:bg-neutral-900',
          'text-neutral-800 dark:text-neutral-200',
          showLineNumbers && 'line-numbers'
        )}
        style={{ borderRadius: 0 }}
      >
        <code className={clsx(className, 'text-neutral-800 dark:text-neutral-200')}>{children}</code>
      </pre>
    </div>
  );
}

// Callout Component
function Callout({ children, type = 'info', title }: CalloutProps) {
  const styles = {
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500',
      icon: Info,
      iconColor: 'text-blue-500',
      title: 'text-blue-800 dark:text-blue-200',
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-900/20 border-amber-500',
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      title: 'text-amber-800 dark:text-amber-200',
    },
    danger: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-500',
      icon: AlertCircle,
      iconColor: 'text-red-500',
      title: 'text-red-800 dark:text-red-200',
    },
    success: {
      container: 'bg-green-50 dark:bg-green-900/20 border-green-500',
      icon: CheckCircle,
      iconColor: 'text-green-500',
      title: 'text-green-800 dark:text-green-200',
    },
    tip: {
      container: 'bg-purple-50 dark:bg-purple-900/20 border-purple-500',
      icon: Info,
      iconColor: 'text-purple-500',
      title: 'text-purple-800 dark:text-purple-200',
    },
  };

  const style = styles[type];
  const Icon = style.icon;

  const defaultTitles: Record<string, string> = {
    info: 'Note',
    warning: 'Warning',
    danger: 'Important',
    success: 'Success',
    tip: 'Tip',
  };

  return (
    <div
      className={clsx(
        'my-6 p-4 border-l-4 rounded-r-lg',
        style.container
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={clsx('h-5 w-5 flex-shrink-0 mt-0.5', style.iconColor)} />
        <div className="flex-1 min-w-0">
          {title !== '' && (
            <p className={clsx('font-semibold mb-1', style.title)}>
              {title || defaultTitles[type]}
            </p>
          )}
          <div className="text-gray-700 dark:text-gray-300 text-sm [&>p]:my-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Diagram Component (for Mermaid or custom diagrams)
function Diagram({ children, title, caption }: DiagramProps) {
  return (
    <figure className="my-8">
      {title && (
        <figcaption className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {title}
        </figcaption>
      )}
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-x-auto">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Related Topics Component
function RelatedTopics({ topics }: RelatedTopicsProps) {
  return (
    <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Related Topics
      </h4>
      <div className="grid gap-3">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
            <div>
              <span className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {topic.title}
              </span>
              {topic.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {topic.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Tab Container Component
function TabContainer({ children, tabs, defaultTab = 0 }: TabContainerProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Convert children to array and filter to valid elements
  const childrenArray = Array.isArray(children) ? children : [children];
  const validChildren = childrenArray.filter(Boolean);

  return (
    <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Tab headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={clsx(
              'px-4 py-3 text-sm font-medium transition-colors',
              activeTab === index
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 -mb-px bg-white dark:bg-gray-900'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4 bg-white dark:bg-gray-900">
        {validChildren[activeTab]}
      </div>
    </div>
  );
}

// Metrics Card Component
function MetricsCard({
  title,
  value,
  description,
  change,
  changeType = 'neutral',
}: MetricsCardProps) {
  const changeColors = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        {change && (
          <span className={clsx('text-sm font-medium', changeColors[changeType])}>
            {change}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

// Collapsible/Accordion Component
function Collapsible({
  children,
  title,
  defaultOpen = false,
}: {
  children: ReactNode;
  title: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-gray-900 dark:text-white">
          {title}
        </span>
        <ChevronDown
          className={clsx(
            'h-5 w-5 text-gray-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}

// Custom Link Component
function CustomLink({
  href,
  children,
  ...props
}: {
  href?: string;
  children: ReactNode;
  [key: string]: unknown;
}) {
  if (!href) {
    return <span {...props}>{children}</span>;
  }

  const isExternal = href.startsWith('http') || href.startsWith('//');
  const isAnchor = href.startsWith('#');

  if (isAnchor) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1"
        {...props}
      >
        {children}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

// Custom Image Component
function CustomImage({
  src,
  alt,
  caption,
  width,
  height,
  ...props
}: {
  src?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}) {
  if (!src) return null;

  return (
    <figure className="my-8">
      <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <Image
          src={src}
          alt={alt || ''}
          width={width || 800}
          height={height || 400}
          className="w-full h-auto"
          {...props}
        />
      </div>
      {(caption || alt) && (
        <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
}

// Blockquote variations based on content
function CustomBlockquote({ children, ...props }: { children: ReactNode }) {
  // Check if this is a callout-style blockquote
  const childString = String(children);

  if (childString.startsWith('[!NOTE]') || childString.startsWith('[!INFO]')) {
    return <Callout type="info">{children}</Callout>;
  }
  if (childString.startsWith('[!WARNING]')) {
    return <Callout type="warning">{children}</Callout>;
  }
  if (childString.startsWith('[!DANGER]') || childString.startsWith('[!CAUTION]')) {
    return <Callout type="danger">{children}</Callout>;
  }
  if (childString.startsWith('[!TIP]')) {
    return <Callout type="tip">{children}</Callout>;
  }
  if (childString.startsWith('[!SUCCESS]')) {
    return <Callout type="success">{children}</Callout>;
  }

  // Default blockquote
  return (
    <blockquote
      className="my-6 pl-4 border-l-4 border-primary-500 italic text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </blockquote>
  );
}

// MDX Components mapping
export const mdxComponents = {
  // Override default elements
  h1: (props: { children: ReactNode }) => (
    <h1
      className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0"
      {...props}
    />
  ),
  h2: (props: { children: ReactNode }) => (
    <h2
      className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-4 mt-10 pb-2 border-b border-gray-200 dark:border-gray-700"
      {...props}
    />
  ),
  h3: (props: { children: ReactNode }) => (
    <h3
      className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-8"
      {...props}
    />
  ),
  h4: (props: { children: ReactNode }) => (
    <h4
      className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-6"
      {...props}
    />
  ),
  p: (props: { children: ReactNode }) => (
    <p className="my-4 leading-7 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ul: (props: { children: ReactNode }) => (
    <ul className="my-4 pl-6 list-disc space-y-2 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ol: (props: { children: ReactNode }) => (
    <ol className="my-4 pl-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300" {...props} />
  ),
  li: (props: { children: ReactNode }) => <li className="pl-1" {...props} />,
  a: CustomLink,
  img: CustomImage,
  blockquote: CustomBlockquote,
  pre: ({ children, ...props }: { children: ReactNode }) => {
    // Handle code blocks - the pre contains a code element
    if (
      children &&
      typeof children === 'object' &&
      'props' in children &&
      children.props
    ) {
      return (
        <CodeBlock
          className={children.props.className}
          {...props}
        >
          {children.props.children}
        </CodeBlock>
      );
    }
    return <pre {...props}>{children}</pre>;
  },
  code: ({
    children,
    className,
    ...props
  }: {
    children?: ReactNode;
    className?: string;
  }) => {
    // Inline code (not inside pre)
    if (!className) {
      return (
        <code
          className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-pink-500 dark:text-pink-400 rounded text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    // Code inside pre is handled by CodeBlock
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  table: (props: { children: ReactNode }) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        {...props}
      />
    </div>
  ),
  th: (props: { children: ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800"
      {...props}
    />
  ),
  td: (props: { children: ReactNode }) => (
    <td
      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,

  // Custom components
  Callout,
  Diagram,
  RelatedTopics,
  TabContainer,
  MetricsCard,
  Collapsible,
  CodeBlock,
};

// Wrapper component that provides the MDX components context
export function MDXComponents({ children }: { children: ReactNode }) {
  return <div className="mdx-content">{children}</div>;
}

export default mdxComponents;
