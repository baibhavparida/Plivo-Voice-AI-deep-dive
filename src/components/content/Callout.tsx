'use client';

import { ReactNode } from 'react';
import {
  Info,
  AlertTriangle,
  Lightbulb,
  FileText,
  AlertOctagon,
  type LucideIcon,
} from 'lucide-react';
import { clsx } from 'clsx';

type CalloutType = 'info' | 'warning' | 'tip' | 'note' | 'danger';

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: ReactNode;
}

interface CalloutConfig {
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  titleColor: string;
  defaultTitle: string;
}

const calloutConfig: Record<CalloutType, CalloutConfig> = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-500 dark:border-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-200',
    defaultTitle: 'Info',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-500 dark:border-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-200',
    defaultTitle: 'Warning',
  },
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-500 dark:border-green-400',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-900 dark:text-green-200',
    defaultTitle: 'Tip',
  },
  note: {
    icon: FileText,
    bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    borderColor: 'border-gray-400 dark:border-gray-500',
    iconColor: 'text-gray-600 dark:text-gray-400',
    titleColor: 'text-gray-900 dark:text-gray-200',
    defaultTitle: 'Note',
  },
  danger: {
    icon: AlertOctagon,
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-500 dark:border-red-400',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-200',
    defaultTitle: 'Danger',
  },
};

export default function Callout({ type, title, children }: CalloutProps) {
  const config = calloutConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={clsx(
        'my-6 rounded-lg border-l-4 p-4',
        config.bgColor,
        config.borderColor
      )}
      role="alert"
      aria-label={`${displayTitle} callout`}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('mt-0.5 shrink-0', config.iconColor)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h5
            className={clsx(
              'mb-1 text-sm font-semibold',
              config.titleColor
            )}
          >
            {displayTitle}
          </h5>
          <div className="text-sm text-gray-700 dark:text-gray-300 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ol]:my-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
