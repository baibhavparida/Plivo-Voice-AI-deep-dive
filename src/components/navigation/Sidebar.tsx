'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  Cpu,
  Wrench,
  Building2,
  Lightbulb,
  FileText,
  Layers,
  Zap,
  Shield,
  Users,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { NavigationItem } from '@/types/navigation';

interface SidebarProps {
  navigation: NavigationItem[];
  currentSlug?: string;
}

const iconMap: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  cpu: Cpu,
  wrench: Wrench,
  building: Building2,
  lightbulb: Lightbulb,
  'file-text': FileText,
  layers: Layers,
  zap: Zap,
  shield: Shield,
  users: Users,
  'trending-up': TrendingUp,
};

function getIcon(iconName?: string): LucideIcon | null {
  if (!iconName) return null;
  return iconMap[iconName] || null;
}

interface SidebarItemProps {
  item: NavigationItem;
  depth?: number;
  currentPath: string;
}

function SidebarItem({ item, depth = 0, currentPath }: SidebarItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.href === currentPath;
  const isChildActive = hasChildren
    ? item.children!.some(
        (child) =>
          child.href === currentPath ||
          currentPath.startsWith(child.href + '/') ||
          child.children?.some((grandchild) => grandchild.href === currentPath)
      )
    : false;

  const [isExpanded, setIsExpanded] = useState(isActive || isChildActive);

  // Auto-expand when child becomes active
  useEffect(() => {
    if (isChildActive && !isExpanded) {
      setIsExpanded(true);
    }
  }, [isChildActive, isExpanded]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const Icon = getIcon(item.icon);

  // Section header (depth 0 with children)
  if (depth === 0 && hasChildren) {
    return (
      <li className="pt-4 first:pt-0">
        <button
          onClick={toggleExpanded}
          className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            {item.title}
          </span>
          <ChevronDown
            className={clsx(
              'h-3.5 w-3.5 transition-transform duration-200',
              isExpanded ? 'rotate-0' : '-rotate-90'
            )}
          />
        </button>
        <ul
          className={clsx(
            'mt-1 space-y-0.5 overflow-hidden transition-all duration-200',
            isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          {item.children!.map((child, index) => (
            <SidebarItem
              key={child.href || index}
              item={child}
              depth={depth + 1}
              currentPath={currentPath}
            />
          ))}
        </ul>
      </li>
    );
  }

  // Nested section with children (depth 1)
  if (depth === 1 && hasChildren) {
    return (
      <li>
        <button
          onClick={toggleExpanded}
          className={clsx(
            'flex items-center justify-between w-full pl-4 pr-2 py-1.5 text-sm rounded-md transition-colors',
            isChildActive
              ? 'text-gray-900 dark:text-white font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
          )}
        >
          <span className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            {item.title}
          </span>
          <ChevronRight
            className={clsx(
              'h-4 w-4 text-gray-400 transition-transform duration-200',
              isExpanded ? 'rotate-90' : 'rotate-0'
            )}
          />
        </button>
        <ul
          className={clsx(
            'mt-0.5 overflow-hidden transition-all duration-200',
            isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          {item.children!.map((child, index) => (
            <SidebarItem
              key={child.href || index}
              item={child}
              depth={depth + 1}
              currentPath={currentPath}
            />
          ))}
        </ul>
      </li>
    );
  }

  // Leaf item (no children)
  if (item.href) {
    const isLeafActive = isActive || currentPath.startsWith(item.href + '/');

    return (
      <li>
        <Link
          href={item.href}
          className={clsx(
            'flex items-center gap-2 py-1.5 text-sm rounded-md transition-colors',
            depth === 1 && 'pl-4 pr-2',
            depth === 2 && 'pl-8 pr-2',
            isLeafActive
              ? 'text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50'
          )}
        >
          {Icon && <Icon className="h-4 w-4" />}
          <span>{item.title}</span>
        </Link>
      </li>
    );
  }

  return null;
}

export default function Sidebar({ navigation, currentSlug }: SidebarProps) {
  const pathname = usePathname();
  const currentPath = pathname ?? '/';

  return (
    <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 py-4">
      <nav aria-label="Sidebar navigation">
        <ul className="space-y-1 px-3">
          {navigation.map((item, index) => (
            <SidebarItem
              key={item.href || index}
              item={item}
              currentPath={currentPath}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
