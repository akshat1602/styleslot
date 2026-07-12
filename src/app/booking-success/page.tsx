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
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-neutral-200">
          <p className="text-sm font-medium text-green-600">
            Booking confirmed
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Appointment booked successfully
          </h1>

          <p className="mt-3 text-sm text-neutral-600">
            {name
              ? `${name}, your appointment has been saved.`
              : "Your appointment has been saved."}
          </p>

          <div className="mt-6 rounded-xl bg-neutral-50 p-5 ring-1 ring-neutral-200">
            <div className="space-y-3 text-sm text-neutral-700">
              <p>
                <span className="font-medium text-neutral-900">Service:</span>{" "}
                {service || "Not available"}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Date:</span>{" "}
                {date || "Not available"}
              </p>
              <p>
                <span className="font-medium text-neutral-900">Time:</span>{" "}
                {slot || "Not available"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="/"
              className="rounded-xl bg-neutral-900 px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Book another appointment
            </a>

            <a
              href="/dashboard"
              className="rounded-xl bg-white px-5 py-3 text-center text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 transition hover:bg-neutral-100"
            >
              View dashboard
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}