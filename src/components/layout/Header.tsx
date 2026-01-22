'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  children?: { label: string; href: string; description?: string }[];
}

const mainNavItems: NavItem[] = [
  { label: 'AI Agents', href: '/topics/agent-architecture' },
  {
    label: 'Platform',
    href: '/topics/infrastructure',
    hasDropdown: true,
    children: [
      { label: 'Infrastructure', href: '/topics/infrastructure', description: 'Audio pipelines and streaming' },
      { label: 'Foundations', href: '/topics/foundations', description: 'Core voice AI concepts' },
      { label: 'LLM Integration', href: '/topics/llm-integration', description: 'Language model integration' },
    ],
  },
  { label: 'Documentation', href: '/topics/welcome/introduction' },
  { label: 'Pricing', href: 'https://www.plivo.com/pricing/' },
];

function ThemeToggleButton() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}

interface HeaderProps {
  onSearchOpen?: () => void;
  onMobileMenuOpen?: () => void;
}

export default function Header({ onSearchOpen, onMobileMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = useCallback((label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  const isExternalLink = (href: string) => href.startsWith('http');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center"
            >
              <Image
                src="/plivo-logo.svg"
                alt="Plivo"
                width={80}
                height={28}
                className="dark:invert"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-1" aria-label="Main navigation" ref={dropdownRef}>
            {mainNavItems.map((item) => (
              <div key={item.label} className="relative">
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={clsx(
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-md',
                        isActive(item.href)
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={clsx(
                          'h-4 w-4 transition-transform',
                          openDropdown === item.label ? 'rotate-180' : ''
                        )}
                      />
                    </button>
                    {openDropdown === item.label && item.children && (
                      <div className="absolute top-full left-0 mt-1 w-64 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <span className="block text-sm font-medium text-gray-900 dark:text-white">
                              {child.label}
                            </span>
                            {child.description && (
                              <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {child.description}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : isExternalLink(item.href) ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={clsx(
                      'px-4 py-2 text-sm font-medium transition-colors rounded-md',
                      'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      'px-4 py-2 text-sm font-medium transition-colors rounded-md',
                      isActive(item.href)
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <ThemeToggleButton />
            <a
              href="https://www.plivo.com/contact/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Contact Sales
            </a>
            <a
              href="https://console.plivo.com/accounts/register/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Get Access
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
