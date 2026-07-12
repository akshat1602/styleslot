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
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
          <p className="text-sm font-medium text-neutral-500">
            Dashboard / Reschedule appointment
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Edit appointment
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Update the service, date, or time for this appointment.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-neutral-500">Customer</p>
              <p className="mt-1 text-sm text-neutral-900">
                {appointment.customerName}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">Phone</p>
              <p className="mt-1 text-sm text-neutral-900">
                {appointment.customerPhone}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">
                Current service
              </p>
              <p className="mt-1 text-sm text-neutral-900">
                {appointment.service.name} · {appointment.service.durationMin} min
                · ₹{appointment.service.price}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">
                Current schedule
              </p>
              <p className="mt-1 text-sm text-neutral-900">
                {formatDateInput(appointment.appointmentDate)} at{" "}
                {formatTimeInput(appointment.startTime)}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">Status</p>
              <p className="mt-1 text-sm text-neutral-900">
                {appointment.status}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-500">
                Appointment ID
              </p>
              <p className="mt-1 break-all text-sm text-neutral-900">
                {appointment.id}
              </p>
            </div>
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

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/dashboard?date=${backDate}`}
              className="rounded-xl bg-white px-5 py-3 text-center text-sm font-medium text-neutral-700 ring-1 ring-neutral-300 transition hover:bg-neutral-100"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}