export default function DashboardLoading() {
  return (
    <main className="ui-shell">
      <section className="ui-container py-8 sm:py-10">
        <div className="mb-6 rounded-[28px] border border-neutral-200 bg-white/95 p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <div className="h-4 w-28 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-9 w-60 animate-pulse rounded-2xl bg-neutral-200" />
              <div className="h-4 w-72 animate-pulse rounded-full bg-neutral-200" />
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-64">
              <div className="h-11 animate-pulse rounded-2xl bg-neutral-200" />
              <div className="h-11 animate-pulse rounded-2xl bg-neutral-200" />
            </div>
          </div>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-24 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-4 h-8 w-20 animate-pulse rounded-2xl bg-neutral-200" />
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-24 animate-pulse rounded-full bg-neutral-200" />
              <div className="mt-4 h-8 w-24 animate-pulse rounded-2xl bg-neutral-200" />
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-6 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="h-6 w-36 animate-pulse rounded-2xl bg-neutral-200" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded-full bg-neutral-200" />

              <div className="mt-6 space-y-3">
                {Array.from({ length: 4 }).map((__, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4"
                  >
                    <div className="h-4 w-32 animate-pulse rounded-full bg-neutral-200" />
                    <div className="mt-3 h-4 w-24 animate-pulse rounded-full bg-neutral-200" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-12 flex-1 animate-pulse rounded-2xl bg-neutral-200" />
            <div className="h-12 w-28 animate-pulse rounded-2xl bg-neutral-200" />
            <div className="h-12 w-28 animate-pulse rounded-2xl bg-neutral-200" />
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-24 animate-pulse rounded-full bg-neutral-200"
            />
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm lg:block">
          <div className="grid grid-cols-6 gap-4 border-b border-neutral-200 bg-neutral-50 px-4 py-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-20 animate-pulse rounded-full bg-neutral-200"
              />
            ))}
          </div>

          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-6 gap-4 border-t border-neutral-200 px-4 py-4"
            >
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-4 w-24 animate-pulse rounded-full bg-neutral-200"
                />
              ))}
            </div>
          ))}
        </div>

        <div className="grid gap-3 lg:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="h-4 w-20 animate-pulse rounded-full bg-neutral-200" />
                  <div className="h-4 w-28 animate-pulse rounded-full bg-neutral-200" />
                </div>
                <div className="h-6 w-24 animate-pulse rounded-full bg-neutral-200" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="h-4 w-40 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-4 w-36 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-4 w-32 animate-pulse rounded-full bg-neutral-200" />
              </div>

              <div className="mt-4 flex gap-2">
                <div className="h-10 w-24 animate-pulse rounded-2xl bg-neutral-200" />
                <div className="h-10 w-24 animate-pulse rounded-2xl bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}