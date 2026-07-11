import Link from "next/link";
import ServiceForm from "@/components/service-form";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <section className="p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-[28px] border border-neutral-200 bg-white/95 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="ui-pill bg-neutral-900 text-white">
                  New service
                </span>
                <span className="ui-pill bg-white text-neutral-600 ring-1 ring-neutral-200">
                  Dashboard setup
                </span>
              </div>

              <p className="mt-4 text-sm font-medium text-neutral-500">
                Dashboard / Services / New
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                Add service
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                Create a new service customers can book. Add a clear service
                name, duration, price, and availability status.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:min-w-[220px]">
              <Link
                href="/dashboard/services"
                className="ui-btn ui-btn-secondary w-full"
              >
                Back to services
              </Link>

              <Link
                href="/dashboard"
                className="ui-btn ui-btn-secondary w-full"
              >
                Dashboard home
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
          <div className="ui-card p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                Service details
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Fill in the form below to create a new bookable service for
                your salon.
              </p>
            </div>

            <ServiceForm action={createService} submitLabel="Create service" />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="ui-card p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Tips
              </h3>
              <div className="mt-4 space-y-3 text-sm leading-6 text-neutral-600">
                <p>
                  Use clear service names so customers can quickly understand
                  what they are booking.
                </p>
                <p>
                  Keep pricing and duration accurate because they affect slot
                  generation and dashboard reporting.
                </p>
                <p>
                  You can always edit the service later or toggle its active
                  status from the services page.
                </p>
              </div>
            </div>

            <div className="ui-card-soft p-5">
              <p className="text-sm font-semibold text-neutral-900">
                Recommended examples
              </p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>Haircut · 45 min · ₹499</li>
                <li>Beard styling · 30 min · ₹299</li>
                <li>Hair spa · 60 min · ₹899</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}