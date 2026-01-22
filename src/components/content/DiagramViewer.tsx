'use client';

import { useEffect, useRef, useState, useId } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

interface DiagramViewerProps {
  chart: string;
  caption?: string;
}

type RenderState = 'loading' | 'success' | 'error';

export default function DiagramViewer({ chart, caption }: DiagramViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderState, setRenderState] = useState<RenderState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const uniqueId = useId();
  const diagramId = `mermaid-${uniqueId.replace(/:/g, '-')}`;

  useEffect(() => {
    let isMounted = true;

    const renderDiagram = async () => {
      if (!containerRef.current) return;

      setRenderState('loading');
      setErrorMessage('');

      try {
        // Dynamically import mermaid for SSR safety
        const mermaid = (await import('mermaid')).default;

        // Initialize mermaid with configuration
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
          themeVariables: {
            primaryColor: '#22c55e',
            primaryTextColor: '#fff',
            primaryBorderColor: '#16a34a',
            lineColor: '#6b7280',
            secondaryColor: '#374151',
            tertiaryColor: '#1f2937',
            background: '#111827',
            mainBkg: '#1f2937',
            nodeBorder: '#4b5563',
            clusterBkg: '#1f2937',
            clusterBorder: '#374151',
            titleColor: '#f3f4f6',
            edgeLabelBackground: '#1f2937',
            actorBorder: '#22c55e',
            actorBkg: '#1f2937',
            actorTextColor: '#f3f4f6',
            actorLineColor: '#4b5563',
            signalColor: '#9ca3af',
            signalTextColor: '#f3f4f6',
            labelBoxBkgColor: '#1f2937',
            labelBoxBorderColor: '#4b5563',
            labelTextColor: '#f3f4f6',
            loopTextColor: '#9ca3af',
            noteBorderColor: '#4b5563',
            noteBkgColor: '#374151',
            noteTextColor: '#f3f4f6',
            activationBorderColor: '#22c55e',
            activationBkgColor: '#1f2937',
            sequenceNumberColor: '#22c55e',
          },
        });

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Render the diagram
        const { svg } = await mermaid.render(diagramId, chart);

        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setRenderState('success');
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        if (isMounted) {
          setRenderState('error');
          setErrorMessage(
            err instanceof Error ? err.message : 'Failed to render diagram'
          );
        }
      }
    };

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, diagramId]);

  const handleRetry = () => {
    // Trigger re-render by updating state
    setRenderState('loading');
    // The effect will re-run due to the dependency array
    const event = new CustomEvent('mermaid-retry');
    window.dispatchEvent(event);
  };

  return (
    <figure className="my-8">
      <div
        className={clsx(
          'relative overflow-hidden rounded-lg border',
          'border-gray-200 bg-gray-900 dark:border-gray-700',
          'min-h-[200px]'
        )}
      >
        {/* Loading skeleton */}
        {renderState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-green-500" />
              </div>
              <span className="text-sm text-gray-400">Rendering diagram...</span>
            </div>
            {/* Skeleton placeholder */}
            <div className="absolute inset-4 top-16 flex flex-col gap-4 opacity-30">
              <div className="mx-auto h-16 w-32 animate-pulse rounded bg-gray-800" />
              <div className="flex justify-center gap-4">
                <div className="h-12 w-24 animate-pulse rounded bg-gray-800" />
                <div className="h-12 w-24 animate-pulse rounded bg-gray-800" />
              </div>
              <div className="mx-auto h-20 w-40 animate-pulse rounded bg-gray-800" />
            </div>
          </div>
        )}

        {/* Error state */}
        {renderState === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 p-6">
            <div className="flex max-w-md flex-col items-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                <AlertCircle className="h-6 w-6 text-red-400" aria-hidden="true" />
              </div>
              <div>
                <h4 className="mb-1 font-medium text-gray-200">
                  Failed to render diagram
                </h4>
                <p className="text-sm text-gray-400">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Retry
              </button>
              {/* Show raw mermaid code as fallback */}
              <details className="w-full">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400">
                  View diagram source
                </summary>
                <pre className="mt-2 max-h-48 overflow-auto rounded bg-gray-800 p-3 text-left text-xs text-gray-400">
                  {chart}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Diagram container */}
        <div
          ref={containerRef}
          className={clsx(
            'flex justify-center p-6 [&>svg]:max-w-full',
            renderState !== 'success' && 'invisible'
          )}
          aria-label={caption || 'Diagram'}
        />
      </div>

      {/* Caption */}
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
