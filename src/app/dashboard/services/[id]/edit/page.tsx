import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServiceForm from "@/components/service-form";
import { updateService } from "../../actions";

type EditServicePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditServicePage({
  params,
}: EditServicePageProps) {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });

  if (!service) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
          <p className="text-sm font-medium text-neutral-500">
            Dashboard / Services / Edit
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Edit service
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Update the service name, duration, and pricing.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-neutral-500">Service</p>
              <p className="mt-1 text-sm text-neutral-900">{service.name}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">Status</p>
              <p className="mt-1 text-sm text-neutral-900">
                {service.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">Duration</p>
              <p className="mt-1 text-sm text-neutral-900">
                {service.durationMin} min
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">Price</p>
              <p className="mt-1 text-sm text-neutral-900">₹{service.price}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">
                Appointments
              </p>
              <p className="mt-1 text-sm text-neutral-900">
                {service._count.appointments}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">Service ID</p>
              <p className="mt-1 break-all text-sm text-neutral-900">
                {service.id}
              </p>
            </div>
          </div>

          <ServiceForm
            action={updateService}
            submitLabel="Save service"
            initialValues={{
              id: service.id,
              name: service.name,
              durationMin: service.durationMin,
              price: service.price,
            }}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/services"
              className="rounded-xl bg-white px-5 py-3 text-center text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 transition hover:bg-neutral-100"
            >
              Back to services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}