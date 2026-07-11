type BookingSuccessPageProps = {
  searchParams?: Promise<{
    date?: string;
    slot?: string;
    service?: string;
    name?: string;
  }>;
};

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const params = await searchParams;

  const date = params?.date ?? "";
  const slot = params?.slot ?? "";
  const service = params?.service ?? "";
  const name = params?.name ?? "";

  return (
    <main className="ui-shell">
      <section className="ui-container py-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="ui-hero-card overflow-hidden p-8 sm:p-10">
            <div className="flex flex-col gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700 shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path
                    d="M20 6L9 17l-5-5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-green-700">
                  Booking confirmed
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                  Appointment booked successfully
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                  {name
                    ? `${name}, your appointment has been scheduled successfully.`
                    : "Your appointment has been scheduled successfully."}{" "}
                  Please keep the date and time handy for your visit.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="ui-card-soft p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                    Service
                  </p>
                  <p className="mt-2 text-sm font-semibold text-neutral-900">
                    {service || "Not available"}
                  </p>
                </div>

                <div className="ui-card-soft p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                    Date
                  </p>
                  <p className="mt-2 text-sm font-semibold text-neutral-900">
                    {date || "Not available"}
                  </p>
                </div>

                <div className="ui-card-soft p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                    Time
                  </p>
                  <p className="mt-2 text-sm font-semibold text-neutral-900">
                    {slot || "Not available"}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white/70 p-5">
                <p className="text-sm font-medium text-neutral-900">
                  What happens next
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Arrive a few minutes early for your appointment. If you need to
                  make changes, the salon admin can manage bookings from the
                  dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="/" className="ui-btn ui-btn-primary">
                  Book another appointment
                </a>

                <a href="/dashboard" className="ui-btn ui-btn-secondary">
                  View dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}