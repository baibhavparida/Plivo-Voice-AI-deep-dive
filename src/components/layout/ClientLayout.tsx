'use client';

import { ReactNode, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ThemeProvider } from '@/lib/theme-context';

// Dynamically import Header, SearchBar, and Footer with no SSR
const Header = dynamic(() => import('./Header'), { ssr: false });
const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });
const Footer = dynamic(() => import('./Footer'), { ssr: false });

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        {mounted ? <Header /> : <HeaderSkeleton />}
        {mounted ? <SearchBar /> : <SearchBarSkeleton />}
        <main className="flex-1">{children}</main>
        {mounted ? <Footer /> : <FooterSkeleton />}
      </div>
    </ThemeProvider>
  );
}

// Simple skeleton components for SSR
function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}

function SearchBarSkeleton() {
  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function FooterSkeleton() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </footer>
  );
}
