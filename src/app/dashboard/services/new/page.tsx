import Link from "next/link";
import ServiceForm from "@/components/service-form";
import { createService } from "../actions";

export default function NewServicePage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
          <p className="text-sm font-medium text-neutral-500">
            Dashboard / Services / New
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Add service
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Create a new service customers can book.
          </p>
        </div>

        <ServiceForm action={createService} submitLabel="Create service" />

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/services"
            className="rounded-xl bg-white px-5 py-3 text-center text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 transition hover:bg-neutral-100"
          >
            Back to services
          </Link>
        </div>
      </section>
    </main>
  );
}