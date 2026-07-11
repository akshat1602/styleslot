import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleServiceActive } from "./actions";

function getServiceStatusClasses(isActive: boolean) {
  return isActive
    ? "bg-green-100 text-green-700 ring-1 ring-green-200"
    : "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200";
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    include: {
      _count: {
        select: {
          appointments: true,
        },
      },
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  const totalServices = services.length;
  const activeServices = services.filter((service) => service.isActive).length;
  const inactiveServices = totalServices - activeServices;
  const totalAppointments = services.reduce(
    (sum, service) => sum + service._count.appointments,
    0
  );

  return (
    <section className="p-3 sm:p-4 lg:p-5">
      <div className="mb-6 rounded-[28px] border border-neutral-200 bg-white/95 p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="ui-pill bg-neutral-900 text-white">
                Services
              </span>
              <span className="ui-pill bg-white text-neutral-600 ring-1 ring-neutral-200">
                Dashboard management
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-neutral-500">
              Dashboard / Services
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
              Manage services
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
              Add, edit, and control which services are available for booking.
              Keep offerings organized and easy to manage.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:min-w-[260px] lg:items-stretch">
            <Link
              href="/dashboard/services/new"
              className="ui-btn ui-btn-primary w-full"
            >
              Add service
            </Link>

            <Link
              href="/dashboard"
              className="ui-btn ui-btn-secondary w-full"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="ui-stat-card">
          <p className="text-sm text-neutral-500">Total services</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
            {totalServices}
          </p>
        </div>

        <div className="ui-stat-card">
          <p className="text-sm text-neutral-500">Active services</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-green-700">
            {activeServices}
          </p>
        </div>

        <div className="ui-stat-card">
          <p className="text-sm text-neutral-500">Inactive services</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
            {inactiveServices}
          </p>
        </div>

        <div className="ui-stat-card">
          <p className="text-sm text-neutral-500">Total appointments</p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-neutral-900">
            {totalAppointments}
          </p>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="ui-card p-8 text-center sm:p-10">
          <div className="mx-auto max-w-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M12 5v14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 12h14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-neutral-900">
              No services yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Create your first service so customers can start booking
              appointments online.
            </p>

            <div className="mt-6">
              <Link
                href="/dashboard/services/new"
                className="ui-btn ui-btn-primary"
              >
                Add service
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm lg:block">
            <table className="min-w-full text-left">
              <thead className="bg-neutral-50 text-sm text-neutral-600">
                <tr>
                  <th className="px-4 py-4 font-medium">Service</th>
                  <th className="px-4 py-4 font-medium">Duration</th>
                  <th className="px-4 py-4 font-medium">Price</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Appointments</th>
                  <th className="px-4 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="border-t border-neutral-200 align-top"
                  >
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-neutral-900">
                        {service.name}
                      </p>
                      <p className="mt-1 break-all text-xs text-neutral-500">
                        {service.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {service.durationMin} min
                    </td>

                    <td className="px-4 py-4 text-sm font-medium text-neutral-800">
                      ₹{service.price}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getServiceStatusClasses(
                          service.isActive
                        )}`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-neutral-700">
                      {service._count.appointments}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/dashboard/services/${service.id}/edit`}
                          className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
                        >
                          Edit
                        </Link>

                        <form action={toggleServiceActive}>
                          <input
                            type="hidden"
                            name="serviceId"
                            value={service.id}
                          />
                          <button
                            type="submit"
                            className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                          >
                            {service.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {services.map((service) => (
              <div key={service.id} className="ui-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {service.name}
                    </p>
                    <p className="mt-1 text-sm text-neutral-600">
                      {service.durationMin} min · ₹{service.price}
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getServiceStatusClasses(
                      service.isActive
                    )}`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-sm text-neutral-600">
                  <p>
                    <span className="font-medium text-neutral-800">
                      Appointments:
                    </span>{" "}
                    {service._count.appointments}
                  </p>
                  <p className="break-all">
                    <span className="font-medium text-neutral-800">ID:</span>{" "}
                    {service.id}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/services/${service.id}/edit`}
                    className="rounded-xl bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
                  >
                    Edit
                  </Link>

                  <form action={toggleServiceActive}>
                    <input type="hidden" name="serviceId" value={service.id} />
                    <button
                      type="submit"
                      className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
                    >
                      {service.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}