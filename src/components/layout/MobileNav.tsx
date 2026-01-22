'use client';

import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { X, ChevronRight, Mic, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  external?: boolean;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navigation?: NavItem[];
}

const defaultNavigation: NavItem[] = [
  {
    label: 'Foundations',
    href: '/foundations',
    children: [
      { label: 'Introduction to Voice AI', href: '/foundations/introduction' },
      { label: 'Core Concepts', href: '/foundations/core-concepts' },
      { label: 'Voice Processing Pipeline', href: '/foundations/voice-pipeline' },
      { label: 'Audio Fundamentals', href: '/foundations/audio-fundamentals' },
    ],
  },
  {
    label: 'Infrastructure',
    href: '/infrastructure',
    children: [
      { label: 'System Architecture', href: '/infrastructure/architecture' },
      { label: 'Telephony Integration', href: '/infrastructure/telephony' },
      { label: 'WebRTC', href: '/infrastructure/webrtc' },
      { label: 'Scaling & Performance', href: '/infrastructure/scaling' },
    ],
  },
  {
    label: 'LLM Integration',
    href: '/llm-integration',
    children: [
      { label: 'Overview', href: '/llm-integration/overview' },
      { label: 'Prompt Engineering', href: '/llm-integration/prompts' },
      { label: 'Streaming Responses', href: '/llm-integration/streaming' },
      { label: 'Function Calling', href: '/llm-integration/function-calling' },
    ],
  },
  {
    label: 'Use Cases',
    href: '/use-cases',
    children: [
      { label: 'Customer Service', href: '/use-cases/customer-service' },
      { label: 'Sales & Lead Qualification', href: '/use-cases/sales' },
      { label: 'Healthcare', href: '/use-cases/healthcare' },
      { label: 'Education', href: '/use-cases/education' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Best Practices', href: '/resources/best-practices' },
      { label: 'Architecture Patterns', href: '/resources/architecture-patterns' },
      { label: 'Glossary', href: '/resources/glossary' },
      { label: 'FAQ', href: '/resources/faq' },
    ],
  },
];

export default function MobileNav({ isOpen, onClose, navigation = defaultNavigation }: MobileNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the close button when opened
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Handle link click
  const handleLinkClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Navigation drawer */}
      <div
        ref={navRef}
        className={clsx(
          'fixed inset-y-0 left-0 w-full max-w-xs',
          'bg-white dark:bg-neutral-900',
          'shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={handleLinkClick}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black">
              <Mic className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="text-lg font-semibold text-neutral-900 dark:text-white">
              Voice AI
            </span>
          </Link>

          <button
            ref={closeButtonRef}
            type="button"
            className="p-2 -mr-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
            onClick={onClose}
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation content */}
        <nav
          className="flex-1 overflow-y-auto py-4 px-2"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1" role="list">
            {navigation.map((item) => (
              <li key={item.href}>
                {/* Parent item */}
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-3 py-2.5 text-base font-medium text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <span>{item.label}</span>
                  {item.children && item.children.length > 0 && (
                    <ChevronRight className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                  )}
                </Link>

                {/* Child items */}
                {item.children && item.children.length > 0 && (
                  <ul className="mt-1 ml-4 space-y-1 border-l-2 border-neutral-200 dark:border-neutral-700 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={handleLinkClick}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <span>{child.label}</span>
                          {child.external && (
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <span>Powered by</span>
            <a
              href="https://www.plivo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-black dark:text-white font-semibold hover:underline"
            >
              Plivo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
