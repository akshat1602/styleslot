"use client";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({
  error,
  reset,
}: DashboardErrorProps) {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto flex max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="w-full rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-200">
          <p className="text-sm font-medium text-neutral-500">
            Dashboard error
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
            Something went wrong
          </h1>

          <p className="mt-3 text-sm text-neutral-600">
            We couldn&apos;t load the dashboard right now. Please try again.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Try again
            </button>

            <a
              href="/"
              className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 transition hover:bg-neutral-100"
            >
              Back to booking page
            </a>
          </div>

          {process.env.NODE_ENV === "development" ? (
            <pre className="mt-6 overflow-x-auto rounded-xl bg-neutral-100 p-4 text-left text-xs text-red-600">
              {error.message}
            </pre>
          ) : null}
        </div>
      </section>
    </main>
  );
}