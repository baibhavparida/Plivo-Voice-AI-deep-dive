'use client';

import {
  useState,
  useCallback,
  useRef,
  useId,
  KeyboardEvent,
  ReactNode,
} from 'react';
import { clsx } from 'clsx';

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabContainerProps {
  tabs: Tab[];
}

export default function TabContainer({ tabs }: TabContainerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uniqueId = useId();

  const handleTabChange = useCallback((index: number) => {
    if (index === activeIndex) return;

    setIsTransitioning(true);
    // Small delay for animation
    setTimeout(() => {
      setActiveIndex(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 100);
  }, [activeIndex]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      let newIndex: number | null = null;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== null) {
        handleTabChange(newIndex);
        tabRefs.current[newIndex]?.focus();
      }
    },
    [tabs.length, handleTabChange]
  );

  const setTabRef = useCallback(
    (index: number) => (el: HTMLButtonElement | null) => {
      tabRefs.current[index] = el;
    },
    []
  );

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="my-6">
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Content tabs"
        className="relative flex border-b border-gray-200 dark:border-gray-700"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          const tabId = `${uniqueId}-tab-${index}`;
          const panelId = `${uniqueId}-panel-${index}`;

          return (
            <button
              key={tabId}
              ref={setTabRef(index)}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabChange(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={clsx(
                'relative px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'dark:focus-visible:ring-offset-gray-900',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              )}
            >
              {tab.label}
              {/* Active indicator */}
              {isActive && (
                <span
                  className={clsx(
                    'absolute inset-x-0 -bottom-px h-0.5 bg-primary-600 dark:bg-primary-400',
                    'transition-all duration-200'
                  )}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div className="relative mt-4">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          const tabId = `${uniqueId}-tab-${index}`;
          const panelId = `${uniqueId}-panel-${index}`;

          return (
            <div
              key={panelId}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              tabIndex={0}
              hidden={!isActive}
              className={clsx(
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                'dark:focus-visible:ring-offset-gray-900',
                'rounded-lg',
                isActive && !isTransitioning
                  ? 'animate-fadeIn opacity-100'
                  : 'opacity-0'
              )}
            >
              <div className="prose prose-gray max-w-none dark:prose-invert">
                {tab.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Animation keyframes via style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
