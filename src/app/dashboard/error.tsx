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
    <main className="ui-shell">
      <section className="ui-container py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          <div className="ui-hero-card p-8 text-center sm:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700 shadow-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  d="M12 9v4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17h.01"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.29 3.86l-7.4 12.82A2 2 0 0 0 4.62 20h14.76a2 2 0 0 0 1.73-3.32l-7.4-12.82a2 2 0 0 0-3.42 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="mt-6 text-sm font-medium text-neutral-500">
              Dashboard error
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
              Something went wrong
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">
              We couldn&apos;t load the dashboard right now. Please try again or
              return to the booking page.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => reset()}
                className="ui-btn ui-btn-primary"
              >
                Try again
              </button>

              <a href="/" className="ui-btn ui-btn-secondary">
                Back to booking page
              </a>
            </div>

            {process.env.NODE_ENV === "development" ? (
              <pre className="mt-8 overflow-x-auto rounded-2xl border border-red-100 bg-red-50 p-4 text-left text-xs text-red-700">
                {error.message}
              </pre>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}