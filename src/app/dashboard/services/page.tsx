import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logoutAdmin } from "@/app/login/actions";
import { toggleServiceActive } from "./actions";

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

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Dashboard / Services
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Manage services
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Add, edit, and control which services are available for booking.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Link
              href="/dashboard/services/new"
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Add service
            </Link>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Logout
              </button>
            </form>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 transition hover:bg-neutral-100"
          >
            Back to dashboard
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-200">
            <h2 className="text-lg font-semibold">No services yet</h2>
            <p className="mt-2 text-sm text-neutral-500">
              Create your first service so customers can start booking.
            </p>
            <div className="mt-5">
              <Link
                href="/dashboard/services/new"
                className="inline-flex rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Add service
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 lg:block">
              <table className="min-w-full text-left">
                <thead className="bg-neutral-100 text-sm text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Duration</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Appointments</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-t border-neutral-200">
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-neutral-900">
                          {service.name}
                        </p>
                        <p className="mt-1 break-all text-xs text-neutral-500">
                          {service.id}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700">
                        {service.durationMin} min
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700">
                        ₹{service.price}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            service.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-neutral-200 text-neutral-700"
                          }`}
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
                            className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
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
                              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
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
                <div
                  key={service.id}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200"
                >
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
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        service.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
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
                      className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
                    >
                      Edit
                    </Link>

                    <form action={toggleServiceActive}>
                      <input type="hidden" name="serviceId" value={service.id} />
                      <button
                        type="submit"
                        className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
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
    </main>
  );
}