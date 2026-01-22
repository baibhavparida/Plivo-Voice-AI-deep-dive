'use client';

import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Rating = 'excellent' | 'good' | 'fair' | 'poor';

interface MetricsCardProps {
  name: string;
  value: string | number;
  unit?: string;
  comparison?: {
    label: string;
    value: string | number;
    isHigherBetter?: boolean;
  };
  rating?: Rating;
}

const ratingConfig: Record<
  Rating,
  { label: string; bgColor: string; textColor: string; borderColor: string }
> = {
  excellent: {
    label: 'Excellent',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-300',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  good: {
    label: 'Good',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  fair: {
    label: 'Fair',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-300',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  poor: {
    label: 'Poor',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};

function calculateTrend(
  currentValue: string | number,
  comparisonValue: string | number,
  isHigherBetter: boolean = true
): 'better' | 'worse' | 'same' {
  const current =
    typeof currentValue === 'string'
      ? parseFloat(currentValue)
      : currentValue;
  const compare =
    typeof comparisonValue === 'string'
      ? parseFloat(comparisonValue)
      : comparisonValue;

  if (isNaN(current) || isNaN(compare)) {
    return 'same';
  }

  if (current === compare) {
    return 'same';
  }

  const isBetter = isHigherBetter ? current > compare : current < compare;
  return isBetter ? 'better' : 'worse';
}

export default function MetricsCard({
  name,
  value,
  unit,
  comparison,
  rating,
}: MetricsCardProps) {
  const ratingStyle = rating ? ratingConfig[rating] : null;
  const trend = comparison
    ? calculateTrend(value, comparison.value, comparison.isHigherBetter)
    : null;

  return (
    <div
      className={clsx(
        'rounded-lg border p-5',
        'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800/50',
        'transition-all duration-200',
        'hover:shadow-md dark:hover:shadow-gray-900/30'
      )}
    >
      {/* Metric name */}
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {name}
        </h3>
        {ratingStyle && (
          <span
            className={clsx(
              'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
              ratingStyle.bgColor,
              ratingStyle.textColor,
              ratingStyle.borderColor
            )}
          >
            {ratingStyle.label}
          </span>
        )}
      </div>

      {/* Main value */}
      <div className="mb-3">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </span>
        {unit && (
          <span className="ml-1 text-lg font-medium text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        )}
      </div>

      {/* Comparison */}
      {comparison && (
        <div
          className={clsx(
            'flex items-center gap-2 rounded-md p-2',
            'bg-gray-50 dark:bg-gray-800'
          )}
        >
          {/* Trend icon */}
          {trend === 'better' && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
              <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
          )}
          {trend === 'worse' && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
              <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
          )}
          {trend === 'same' && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <Minus className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            </div>
          )}

          {/* Comparison text */}
          <div className="flex flex-1 items-baseline justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              vs {comparison.label}
            </span>
            <span
              className={clsx(
                'font-medium',
                trend === 'better' && 'text-green-600 dark:text-green-400',
                trend === 'worse' && 'text-red-600 dark:text-red-400',
                trend === 'same' && 'text-gray-600 dark:text-gray-400'
              )}
            >
              {comparison.value}
              {unit && ` ${unit}`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Grid wrapper component for multiple metrics
interface MetricsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function MetricsGrid({ children, columns = 3 }: MetricsGridProps) {
  return (
    <div
      className={clsx(
        'my-6 grid gap-4',
        columns === 2 && 'grid-cols-1 sm:grid-cols-2',
        columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      )}
    >
      {children}
    </div>
  );
}
