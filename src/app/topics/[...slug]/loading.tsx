export default function TopicLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 lg:gap-12">
          {/* Left sidebar skeleton */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0 py-8">
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-gray-100 dark:bg-gray-800 rounded-lg skeleton"
                />
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <main className="flex-1 min-w-0 py-8">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded skeleton" />
              <div className="h-4 w-4 bg-gray-100 dark:bg-gray-800 rounded skeleton" />
              <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded skeleton" />
            </div>

            {/* Title skeleton */}
            <div className="mb-8">
              <div className="h-6 w-20 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-4 skeleton" />
              <div className="h-10 w-3/4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 skeleton" />
              <div className="h-5 w-full bg-gray-100 dark:bg-gray-800 rounded skeleton" />
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-100 dark:bg-gray-800 rounded skeleton"
                  style={{ width: `${Math.random() * 30 + 70}%` }}
                />
              ))}
            </div>

            {/* Code block skeleton */}
            <div className="mt-8 h-40 bg-gray-100 dark:bg-gray-800 rounded-lg skeleton" />

            {/* More content skeleton */}
            <div className="mt-8 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 bg-gray-100 dark:bg-gray-800 rounded skeleton"
                  style={{ width: `${Math.random() * 30 + 70}%` }}
                />
              ))}
            </div>
          </main>

          {/* Right TOC skeleton */}
          <div className="hidden xl:block w-56 flex-shrink-0 py-8">
            <div className="sticky top-24">
              <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded mb-4 skeleton" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-100 dark:bg-gray-800 rounded skeleton"
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
