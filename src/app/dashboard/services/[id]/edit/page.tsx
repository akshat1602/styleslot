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

function getServiceStatusClasses(isActive: boolean) {
  return isActive
    ? "bg-green-100 text-green-700 ring-1 ring-green-200"
    : "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200";
}

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
    <section className="p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-[28px] border border-neutral-200 bg-white/95 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="ui-pill bg-neutral-900 text-white">
                  Edit service
                </span>
                <span
                  className={`ui-pill ${getServiceStatusClasses(
                    service.isActive
                  )}`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mt-4 text-sm font-medium text-neutral-500">
                Dashboard / Services / Edit
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                {service.name}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                Update the service name, duration, and pricing while keeping
                the rest of your services workflow consistent.
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

        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="ui-card p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Current details
              </h3>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Service
                  </p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {service.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Status
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getServiceStatusClasses(
                        service.isActive
                      )}`}
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                      Duration
                    </p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {service.durationMin} min
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                      Price
                    </p>
                    <p className="mt-1 text-sm text-neutral-900">
                      ₹{service.price}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Appointments
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {service._count.appointments}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Service ID
                  </p>
                  <p className="mt-1 break-all text-sm text-neutral-600">
                    {service.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="ui-card-soft p-5">
              <p className="text-sm font-semibold text-neutral-900">
                Editing notes
              </p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
                <p>
                  Update values carefully because they affect what customers
                  see during booking.
                </p>
                <p>
                  If this service should stop appearing on the booking page,
                  you can deactivate it from the services list.
                </p>
              </div>
            </div>
          </aside>

          <div className="ui-card p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
                Edit details
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Make changes below and save when you are ready.
              </p>
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
          </div>
        </div>
      </div>
    </section>
  );
}