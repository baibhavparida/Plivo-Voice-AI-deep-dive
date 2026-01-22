'use client';

import { useState, useCallback, useRef } from 'react';
import { Check, Copy, File } from 'lucide-react';
import { clsx } from 'clsx';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

const languageLabels: Record<string, string> = {
  javascript: 'JavaScript',
  js: 'JavaScript',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  py: 'Python',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sql: 'SQL',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  kotlin: 'Kotlin',
  swift: 'Swift',
  ruby: 'Ruby',
  php: 'PHP',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  markdown: 'Markdown',
  md: 'Markdown',
  text: 'Text',
  plaintext: 'Plain Text',
  diff: 'Diff',
  xml: 'XML',
  graphql: 'GraphQL',
  docker: 'Dockerfile',
  dockerfile: 'Dockerfile',
  makefile: 'Makefile',
  env: 'Environment',
  toml: 'TOML',
  ini: 'INI',
};

function getLanguageLabel(language: string): string {
  return languageLabels[language.toLowerCase()] || language.toUpperCase();
}

export default function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Reset copied state after 2 seconds
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }, [code]);

  const lines = code.split('\n');
  const highlightSet = new Set(highlightLines);

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-gray-200 bg-gray-950 dark:border-gray-700">
      {/* Header with filename or language label */}
      <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-2">
          {filename ? (
            <>
              <File className="h-4 w-4 text-gray-400" aria-hidden="true" />
              <span className="font-mono text-sm text-gray-300">{filename}</span>
            </>
          ) : (
            <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
              {getLanguageLabel(language)}
            </span>
          )}
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          className={clsx(
            'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200',
            copied
              ? 'bg-green-500/20 text-green-400'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
          )}
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          <span
            className={clsx(
              'relative flex h-4 w-4 items-center justify-center',
              'transition-transform duration-200',
              copied && 'animate-bounce'
            )}
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
          </span>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre
          className={clsx(
            `language-${language}`,
            'p-4 text-sm leading-relaxed',
            !showLineNumbers && 'pl-4'
          )}
        >
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => {
                    const lineNumber = index + 1;
                    const isHighlighted = highlightSet.has(lineNumber);

                    return (
                      <tr
                        key={index}
                        className={clsx(
                          'transition-colors',
                          isHighlighted && 'bg-yellow-500/10'
                        )}
                      >
                        <td
                          className={clsx(
                            'select-none pr-4 text-right font-mono text-gray-500',
                            'w-[1%] whitespace-nowrap border-r border-gray-800 pl-4',
                            isHighlighted && 'text-yellow-400/70'
                          )}
                          aria-hidden="true"
                        >
                          {lineNumber}
                        </td>
                        <td
                          className={clsx(
                            'pl-4 font-mono',
                            isHighlighted &&
                              'relative before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-yellow-400'
                          )}
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: line || '\u00A0',
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: code }} />
            )}
          </code>
        </pre>
      </div>

      {/* Language badge (shown when filename is present) */}
      {filename && (
        <div className="absolute right-14 top-2">
          <span className="rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400">
            {getLanguageLabel(language)}
          </span>
        </div>
      )}
    </div>
  );
}
