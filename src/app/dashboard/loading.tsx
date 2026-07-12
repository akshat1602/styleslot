export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
            <div className="h-8 w-56 animate-pulse rounded bg-neutral-200" />
            <div className="h-4 w-72 animate-pulse rounded bg-neutral-200" />
          </div>

          <div className="w-full sm:w-56">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-neutral-200" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-200" />
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
              <div className="mt-3 h-8 w-20 animate-pulse rounded bg-neutral-200" />
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-4 w-52 animate-pulse rounded bg-neutral-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 animate-pulse rounded-full bg-neutral-200"
            />
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 lg:block">
          <div className="grid grid-cols-6 gap-4 border-b border-neutral-200 bg-neutral-100 px-4 py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-20 animate-pulse rounded bg-neutral-200"
              />
            ))}
          </div>

          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-6 gap-4 border-t border-neutral-200 px-4 py-4"
            >
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 w-24 animate-pulse rounded bg-neutral-200"
                />
              ))}
            </div>
          ))}
        </div>

        <div className="grid gap-3 lg:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-neutral-200" />
                  <div className="h-4 w-28 animate-pulse rounded bg-neutral-200" />
                </div>
                <div className="h-6 w-24 animate-pulse rounded-full bg-neutral-200" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-36 animate-pulse rounded bg-neutral-200" />
                <div className="h-4 w-32 animate-pulse rounded bg-neutral-200" />
              </div>

              <div className="mt-4 flex gap-2">
                <div className="h-9 w-24 animate-pulse rounded-lg bg-neutral-200" />
                <div className="h-9 w-24 animate-pulse rounded-lg bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}