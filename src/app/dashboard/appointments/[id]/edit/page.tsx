import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditAppointmentForm from "@/components/edit-appointment-form";

type EditAppointmentPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    date?: string;
  }>;
};

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeInput(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

function getStatusClasses(status: string) {
  switch (status) {
    case "BOOKED":
      return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
    case "COMPLETED":
      return "ui-pill-success ring-1";
    case "CANCELLED":
      return "ui-pill-danger ring-1";
    default:
      return "ring-1";
  }
}

export default async function EditAppointmentPage({
  params,
  searchParams,
}: EditAppointmentPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const appointment = await prisma.appointment.findUnique({
    where: {
      id,
    },
    include: {
      service: {
        select: {
          id: true,
          name: true,
          durationMin: true,
          price: true,
        },
      },
    },
  });

  if (!appointment) {
    notFound();
  }

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      durationMin: true,
      price: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  const backDate =
    resolvedSearchParams?.date || formatDateInput(appointment.appointmentDate);

  return (
    <main className="ui-shell">
      <div className="ui-container py-4 sm:py-6">
        <section>
          <div className="mx-auto max-w-5xl">
            <div className="ui-hero-card mb-6 p-6 sm:p-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="ui-pill"
                      style={{
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      Edit appointment
                    </span>
                    <span
                      className={`ui-pill ${getStatusClasses(
                        appointment.status,
                      )}`}
                      style={
                        appointment.status === "BOOKED" ||
                        appointment.status === "COMPLETED" ||
                        appointment.status === "CANCELLED"
                          ? undefined
                          : {
                              background: "var(--surface-soft)",
                              color: "var(--text-muted)",
                              boxShadow: "inset 0 0 0 1px var(--border)",
                            }
                      }
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <p
                    className="mt-4 text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Dashboard / Appointments / Edit
                  </p>
                  <h2
                    className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl"
                    style={{ color: "var(--text)" }}
                  >
                    {appointment.customerName}
                  </h2>
                  <p
                    className="mt-3 max-w-2xl text-sm leading-6 sm:text-base"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Update the booked service, date, or time while keeping the
                    appointment record accurate.
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[220px]">
                  <Link
                    href={`/dashboard?date=${backDate}`}
                    className="ui-btn ui-btn-secondary w-full"
                  >
                    Back to dashboard
                  </Link>

                  <Link
                    href="/dashboard/services"
                    className="ui-btn ui-btn-secondary w-full"
                  >
                    View services
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-start">
              <aside className="space-y-4 lg:self-start">
                <div className="ui-card p-5">
                  <h3
                    className="text-sm font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Current details
                  </h3>

                  <div className="mt-5 space-y-4">
                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-[0.14em]"
                        style={{ color: "var(--text-soft)" }}
                      >
                        Customer
                      </p>
                      <p
                        className="mt-1 text-sm font-semibold"
                        style={{ color: "var(--text)" }}
                      >
                        {appointment.customerName}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-[0.14em]"
                        style={{ color: "var(--text-soft)" }}
                      >
                        Phone
                      </p>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--text)" }}
                      >
                        {appointment.customerPhone}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-[0.14em]"
                        style={{ color: "var(--text-soft)" }}
                      >
                        Current service
                      </p>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--text)" }}
                      >
                        {appointment.service.name} ·{" "}
                        {appointment.service.durationMin} min · ₹
                        {appointment.service.price}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-[0.14em]"
                        style={{ color: "var(--text-soft)" }}
                      >
                        Current schedule
                      </p>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--text)" }}
                      >
                        {formatDateInput(appointment.appointmentDate)} at{" "}
                        {formatTimeInput(appointment.startTime)}
                      </p>
                    </div>

                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-[0.14em]"
                        style={{ color: "var(--text-soft)" }}
                      >
                        Status
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                            appointment.status,
                          )}`}
                          style={
                            appointment.status === "BOOKED" ||
                            appointment.status === "COMPLETED" ||
                            appointment.status === "CANCELLED"
                              ? undefined
                              : {
                                  background: "var(--surface-soft)",
                                  color: "var(--text-muted)",
                                  boxShadow:
                                    "inset 0 0 0 1px var(--border)",
                                }
                          }
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p
                        className="text-xs font-medium uppercase tracking-[0.14em]"
                        style={{ color: "var(--text-soft)" }}
                      >
                        Appointment ID
                      </p>
                      <p
                        className="mt-1 break-all text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {appointment.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="ui-card-soft p-5">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    Rescheduling notes
                  </p>
                  <div
                    className="mt-3 space-y-2 text-sm leading-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <p>
                      Choose an active service and an available time slot that
                      fits the selected service duration.
                    </p>
                    <p>
                      After saving, return to the dashboard date view to verify
                      the appointment appears in the right slot.
                    </p>
                  </div>
                </div>
              </aside>

              <div className="ui-card p-5 sm:p-6">
                <div className="mb-6">
                  <h3
                    className="text-xl font-semibold tracking-tight"
                    style={{ color: "var(--text)" }}
                  >
                    Edit details
                  </h3>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Make changes below and save when you are ready.
                  </p>
                </div>

                <EditAppointmentForm
                  appointmentId={appointment.id}
                  customerName={appointment.customerName}
                  customerPhone={appointment.customerPhone}
                  initialServiceId={appointment.service.id}
                  initialDate={formatDateInput(appointment.appointmentDate)}
                  initialTime={formatTimeInput(appointment.startTime)}
                  services={services}
                  backDate={backDate}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}