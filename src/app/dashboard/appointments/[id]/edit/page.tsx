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
      return "bg-blue-100 text-blue-700 ring-1 ring-blue-200";
    case "COMPLETED":
      return "bg-green-100 text-green-700 ring-1 ring-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 ring-1 ring-red-200";
    default:
      return "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200";
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
    <section className="p-3 sm:p-4 lg:p-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-[28px] border border-neutral-200 bg-white/95 p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="ui-pill bg-neutral-900 text-white">
                  Edit appointment
                </span>
                <span
                  className={`ui-pill ${getStatusClasses(appointment.status)}`}
                >
                  {appointment.status}
                </span>
              </div>

              <p className="mt-4 text-sm font-medium text-neutral-500">
                Dashboard / Appointments / Edit
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                {appointment.customerName}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
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
          <aside className="space-y-4 lg:sticky lg:top-6">
            <div className="ui-card p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Current details
              </h3>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Customer
                  </p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    {appointment.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Phone
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {appointment.customerPhone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Current service
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {appointment.service.name} · {appointment.service.durationMin} min
                    · ₹{appointment.service.price}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Current schedule
                  </p>
                  <p className="mt-1 text-sm text-neutral-900">
                    {formatDateInput(appointment.appointmentDate)} at{" "}
                    {formatTimeInput(appointment.startTime)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Status
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Appointment ID
                  </p>
                  <p className="mt-1 break-all text-sm text-neutral-600">
                    {appointment.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="ui-card-soft p-5">
              <p className="text-sm font-semibold text-neutral-900">
                Rescheduling notes
              </p>
              <div className="mt-3 space-y-2 text-sm leading-6 text-neutral-600">
                <p>
                  Choose an active service and an available time slot that fits
                  the selected service duration.
                </p>
                <p>
                  After saving, return to the dashboard date view to verify the
                  appointment appears in the right slot.
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
  );
}