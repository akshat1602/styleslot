import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleServiceActive } from "./actions";

function getServiceStatusClasses(isActive: boolean) {
  return isActive ? "ui-pill-success ring-1" : "ring-1";
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
    0,
  );

  return (
    <main className="ui-shell">
      <div className="ui-container py-4 sm:py-6">
        <section>
          <div className="ui-hero-card mb-6 p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="ui-pill"
                    style={{
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    Services
                  </span>
                  <span
                    className="ui-pill"
                    style={{
                      background: "var(--surface)",
                      color: "var(--text-muted)",
                      boxShadow: "inset 0 0 0 1px var(--border)",
                    }}
                  >
                    Dashboard management
                  </span>
                </div>

                <p
                  className="mt-4 text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Dashboard / Services
                </p>
                <h2
                  className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
                  style={{ color: "var(--text)" }}
                >
                  Manage services
                </h2>
                <p
                  className="mt-3 max-w-2xl text-sm leading-6 sm:text-base"
                  style={{ color: "var(--text-muted)" }}
                >
                  Add, edit, and control which services are available for
                  booking. Keep offerings organized and easy to manage.
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
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Total services
              </p>
              <p
                className="mt-3 text-2xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {totalServices}
              </p>
            </div>

            <div className="ui-stat-card">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Active services
              </p>
              <p
                className="mt-3 text-2xl font-bold tracking-tight"
                style={{ color: "var(--success)" }}
              >
                {activeServices}
              </p>
            </div>

            <div className="ui-stat-card">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Inactive services
              </p>
              <p
                className="mt-3 text-2xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {inactiveServices}
              </p>
            </div>

            <div className="ui-stat-card">
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Total appointments
              </p>
              <p
                className="mt-3 text-2xl font-bold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                {totalAppointments}
              </p>
            </div>
          </div>

          {services.length === 0 ? (
            <div className="ui-card p-8 text-center sm:p-10">
              <div className="mx-auto max-w-md">
                <div
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    background: "var(--surface-soft)",
                    color: "var(--text-muted)",
                  }}
                >
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

                <h2
                  className="mt-4 text-lg font-semibold"
                  style={{ color: "var(--text)" }}
                >
                  No services yet
                </h2>
                <p
                  className="mt-2 text-sm leading-6"
                  style={{ color: "var(--text-muted)" }}
                >
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
              <div
                className="hidden overflow-hidden rounded-3xl lg:block"
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <table className="min-w-full text-left">
                  <thead
                    className="text-sm"
                    style={{
                      background: "var(--surface-muted)",
                      color: "var(--text-muted)",
                    }}
                  >
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
                        className="align-top"
                        style={{ borderTop: "1px solid var(--border)" }}
                      >
                        <td className="px-4 py-4">
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--text)" }}
                          >
                            {service.name}
                          </p>
                          <p
                            className="mt-1 break-all text-xs"
                            style={{ color: "var(--text-soft)" }}
                          >
                            {service.id}
                          </p>
                        </td>

                        <td
                          className="px-4 py-4 text-sm"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {service.durationMin} min
                        </td>

                        <td
                          className="px-4 py-4 text-sm font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          ₹{service.price}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getServiceStatusClasses(
                              service.isActive,
                            )}`}
                            style={
                              service.isActive
                                ? undefined
                                : {
                                    background: "var(--surface-soft)",
                                    color: "var(--text-muted)",
                                    boxShadow:
                                      "inset 0 0 0 1px var(--border)",
                                  }
                            }
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td
                          className="px-4 py-4 text-sm"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {service._count.appointments}
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/dashboard/services/${service.id}/edit`}
                              className="ui-btn ui-btn-primary !rounded-xl !px-3 !py-2 !text-xs"
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
                                className="ui-btn !rounded-xl !px-3 !py-2 !text-xs font-medium"
                                style={{
                                  background: "var(--surface-soft)",
                                  color: "var(--text-muted)",
                                  border:
                                    "1px solid var(--border-strong)",
                                }}
                              >
                                {service.isActive
                                  ? "Deactivate"
                                  : "Activate"}
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
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--text)" }}
                        >
                          {service.name}
                        </p>
                        <p
                          className="mt-1 text-sm"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {service.durationMin} min · ₹{service.price}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getServiceStatusClasses(
                          service.isActive,
                        )}`}
                        style={
                          service.isActive
                            ? undefined
                            : {
                                background: "var(--surface-soft)",
                                color: "var(--text-muted)",
                                boxShadow:
                                  "inset 0 0 0 1px var(--border)",
                              }
                        }
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div
                      className="mt-4 space-y-1 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <p>
                        <span
                          className="font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          Appointments:
                        </span>{" "}
                        {service._count.appointments}
                      </p>
                      <p className="break-all">
                        <span
                          className="font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          ID:
                        </span>{" "}
                        {service.id}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/services/${service.id}/edit`}
                        className="ui-btn ui-btn-primary !rounded-xl !px-3 !py-2 !text-xs"
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
                          className="ui-btn !rounded-xl !px-3 !py-2 !text-xs font-medium"
                          style={{
                            background: "var(--surface-soft)",
                            color: "var(--text-muted)",
                            border:
                              "1px solid var(--border-strong)",
                          }}
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
      </div>
    </main>
  );
}