import { ReactNode } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

// Server-safe MDX components (no event handlers, no useState/useEffect)

// Custom Link Component
function CustomLink({
  href,
  children,
  ...props
}: {
  href?: string;
  children?: ReactNode;
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

// Simple code block without copy functionality
function SimpleCodeBlock({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const language = className?.replace('language-', '').replace('code-highlight', '').trim() || 'text';
  const displayLanguage = language || 'code';

  return (
    <div className="relative my-6 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <span className="px-2 py-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-200 dark:bg-neutral-700 rounded">
          {displayLanguage}
        </span>
      </div>
      <pre
        className="p-4 overflow-x-auto bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 m-0"
        style={{ borderRadius: 0 }}
      >
        <code className={`${className || ''} text-neutral-800 dark:text-neutral-200`}>{children}</code>
      </pre>
    </div>
  );
}

// Simple callout without interactivity
function Callout({
  children,
  type = 'info',
  title,
}: {
  children?: ReactNode;
  type?: 'info' | 'warning' | 'danger' | 'success' | 'tip';
  title?: string;
}) {
  const styles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      title: title || 'Info',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-800 dark:text-amber-200',
      title: title || 'Warning',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      title: title || 'Danger',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      title: title || 'Success',
    },
    tip: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-800 dark:text-purple-200',
      title: title || 'Tip',
    },
  };

  const style = styles[type];

  return (
    <div
      className={`my-6 p-4 rounded-lg border-l-4 ${style.bg} ${style.border}`}
      role="alert"
    >
      <p className={`font-semibold mb-1 ${style.text}`}>{style.title}</p>
      <div className={style.text}>{children}</div>
    </div>
  );
}

// Related topics component
function RelatedTopics({
  topics,
}: {
  topics?: Array<{
    title: string;
    href: string;
    description?: string;
  }>;
}) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="my-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Related Topics
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            href={topic.href}
            className="block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">
              {topic.title}
            </span>
            {topic.description && (
              <span className="block mt-1 text-sm text-gray-500 dark:text-gray-400">
                {topic.description}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Server-safe MDX components mapping
export const serverMdxComponents = {
  // Override default elements
  h1: ({ children, ...props }: { children?: ReactNode }) => (
    <h1
      className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-8 first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: { children?: ReactNode }) => (
    <h2
      className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-4 mt-10 pb-2 border-b border-gray-200 dark:border-gray-700"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: { children?: ReactNode }) => (
    <h3
      className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-8"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: { children?: ReactNode }) => (
    <h4
      className="text-lg font-semibold text-gray-900 dark:text-white mb-2 mt-6"
      {...props}
    >
      {children}
    </h4>
  ),
  p: ({ children, ...props }: { children?: ReactNode }) => (
    <p className="my-4 leading-7 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: { children?: ReactNode }) => (
    <ul
      className="my-4 pl-6 list-disc space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: { children?: ReactNode }) => (
    <ol
      className="my-4 pl-6 list-decimal space-y-2 text-gray-700 dark:text-gray-300"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: { children?: ReactNode }) => (
    <li className="pl-1" {...props}>
      {children}
    </li>
  ),
  a: CustomLink,
  blockquote: ({ children, ...props }: { children?: ReactNode }) => (
    <blockquote
      className="my-6 pl-4 border-l-4 border-gray-300 dark:border-gray-600 italic text-gray-600 dark:text-gray-400"
      {...props}
    >
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }: { children?: ReactNode }) => {
    // Handle code blocks
    if (
      children &&
      typeof children === 'object' &&
      'props' in children &&
      children.props
    ) {
      return (
        <SimpleCodeBlock className={children.props.className} {...props}>
          {children.props.children}
        </SimpleCodeBlock>
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
    // Code inside pre is handled by SimpleCodeBlock
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  table: ({ children, ...props }: { children?: ReactNode }) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: { children?: ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: { children?: ReactNode }) => (
    <td
      className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
      {...props}
    >
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-700" />,

  // Custom components
  Callout,
  RelatedTopics,
};

export default serverMdxComponents;
