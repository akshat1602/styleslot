import Link from "next/link";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { updateAppointmentStatus } from "./actions";
import DashboardDateFilter from "@/components/dashboard-date-filter";

type DashboardPageProps = {
  searchParams?: Promise<{
    date?: string;
    status?: string;
  }>;
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayRange(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

function getStatusClasses(status: string) {
  switch (status) {
    case "BOOKED":
      return "bg-blue-100 text-blue-700";
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function getStatusFilterLabel(status: string) {
  switch (status) {
    case "BOOKED":
      return "Booked";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "All";
  }
}

function StatusFilterLinks({
  selectedDate,
  selectedStatus,
}: {
  selectedDate: string;
  selectedStatus: string;
}) {
  const filters = [
    { label: "All", value: "ALL" },
    { label: "Booked", value: "BOOKED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = selectedStatus === filter.value;

        const href =
          filter.value === "ALL"
            ? `/dashboard?date=${selectedDate}`
            : `/dashboard?date=${selectedDate}&status=${filter.value}`;

        return (
          <Link
            key={filter.value}
            href={href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}

function SummaryCards({
  totalAppointments,
  bookedCount,
  completedCount,
  cancelledCount,
  completedRevenue,
}: {
  totalAppointments: number;
  bookedCount: number;
  completedCount: number;
  cancelledCount: number;
  completedRevenue: number;
}) {
  const cards = [
    {
      label: "Total appointments",
      value: totalAppointments,
    },
    {
      label: "Booked",
      value: bookedCount,
    },
    {
      label: "Completed",
      value: completedCount,
    },
    {
      label: "Cancelled",
      value: cancelledCount,
    },
    {
      label: "Completed revenue",
      value: `₹${completedRevenue}`,
    },
  ];

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200"
        >
          <p className="text-sm text-neutral-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-neutral-900">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatusActionButtons({
  appointmentId,
  currentStatus,
  selectedDate,
}: {
  appointmentId: string;
  currentStatus: string;
  selectedDate: string;
}) {
  const isCompleted = currentStatus === "COMPLETED";
  const isCancelled = currentStatus === "CANCELLED";
  const isBooked = currentStatus === "BOOKED";
  const isLocked = !isBooked;

  return (
    <div className="flex flex-wrap gap-2">
      {isBooked ? (
        <Link
          href={`/dashboard/appointments/${appointmentId}/edit?date=${selectedDate}`}
          className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-neutral-800"
        >
          Reschedule
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="rounded-lg bg-neutral-200 px-3 py-2 text-xs font-medium text-neutral-500"
        >
          Reschedule
        </button>
      )}

      <form action={updateAppointmentStatus}>
        <input type="hidden" name="appointmentId" value={appointmentId} />
        <input type="hidden" name="status" value="COMPLETED" />
        <input type="hidden" name="date" value={selectedDate} />
        <button
          type="submit"
          disabled={isCompleted || isLocked}
          className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-200"
        >
          Complete
        </button>
      </form>

      <form action={updateAppointmentStatus}>
        <input type="hidden" name="appointmentId" value={appointmentId} />
        <input type="hidden" name="status" value="CANCELLED" />
        <input type="hidden" name="date" value={selectedDate} />
        <button
          type="submit"
          disabled={isCancelled || isLocked}
          className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-200"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;

  const selectedDate = resolvedSearchParams?.date || getTodayDate();

  const rawStatus = resolvedSearchParams?.status || "ALL";
  const selectedStatus =
    rawStatus === "BOOKED" ||
    rawStatus === "COMPLETED" ||
    rawStatus === "CANCELLED"
      ? rawStatus
      : "ALL";

  const { startOfDay, endOfDay } = getDayRange(selectedDate);

  const allAppointmentsForDay = await prisma.appointment.findMany({
    where: {
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      service: {
        select: {
          name: true,
          durationMin: true,
          price: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const appointments =
    selectedStatus === "ALL"
      ? allAppointmentsForDay
      : allAppointmentsForDay.filter(
          (appointment) => appointment.status === selectedStatus
        );

  const totalAppointments = allAppointmentsForDay.length;
  const bookedCount = allAppointmentsForDay.filter(
    (appointment) => appointment.status === "BOOKED"
  ).length;
  const completedCount = allAppointmentsForDay.filter(
    (appointment) => appointment.status === "COMPLETED"
  ).length;
  const cancelledCount = allAppointmentsForDay.filter(
    (appointment) => appointment.status === "CANCELLED"
  ).length;

  const completedRevenue = allAppointmentsForDay
    .filter((appointment) => appointment.status === "COMPLETED")
    .reduce((sum, appointment) => sum + appointment.service.price, 0);

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Salon dashboard
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Daily appointments
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              View and manage bookings for a selected date.
            </p>
          </div>

          <DashboardDateFilter selectedDate={selectedDate} />
        </div>

        <SummaryCards
          totalAppointments={totalAppointments}
          bookedCount={bookedCount}
          completedCount={completedCount}
          cancelledCount={cancelledCount}
          completedRevenue={completedRevenue}
        />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600">
            {appointments.length} appointment
            {appointments.length === 1 ? "" : "s"} on{" "}
            <span className="font-medium">{selectedDate}</span>
            {selectedStatus !== "ALL" ? (
              <>
                {" "}
                ·{" "}
                <span className="font-medium">
                  {getStatusFilterLabel(selectedStatus)}
                </span>
              </>
            ) : null}
          </p>

          <Link
            href="/"
            className="text-sm font-medium text-neutral-700 underline underline-offset-4"
          >
            Back to booking page
          </Link>
        </div>

        <div className="mb-6">
          <StatusFilterLinks
            selectedDate={selectedDate}
            selectedStatus={selectedStatus}
          />
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-200">
            <h2 className="text-lg font-semibold">No appointments found</h2>
            <p className="mt-2 text-sm text-neutral-500">
              There are no{" "}
              {selectedStatus === "ALL"
                ? ""
                : getStatusFilterLabel(selectedStatus).toLowerCase() + " "}
              bookings for this date.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 lg:block">
              <table className="min-w-full text-left">
                <thead className="bg-neutral-100 text-sm text-neutral-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Time</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="border-t border-neutral-200"
                    >
                      <td className="px-4 py-4 text-sm text-neutral-700">
                        {format(appointment.startTime, "hh:mm a")}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-neutral-900">
                          {appointment.service.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {appointment.service.durationMin} min · ₹
                          {appointment.service.price}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700">
                        {appointment.customerName}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-700">
                        {appointment.customerPhone}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusActionButtons
                          appointmentId={appointment.id}
                          currentStatus={appointment.status}
                          selectedDate={selectedDate}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 lg:hidden">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {format(appointment.startTime, "hh:mm a")}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        {appointment.service.name}
                      </p>
                    </div>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-neutral-600">
                    <p>
                      <span className="font-medium text-neutral-800">
                        Customer:
                      </span>{" "}
                      {appointment.customerName}
                    </p>
                    <p>
                      <span className="font-medium text-neutral-800">Phone:</span>{" "}
                      {appointment.customerPhone}
                    </p>
                    <p>
                      <span className="font-medium text-neutral-800">
                        Details:
                      </span>{" "}
                      {appointment.service.durationMin} min · ₹
                      {appointment.service.price}
                    </p>
                  </div>

                  <div className="mt-4">
                    <StatusActionButtons
                      appointmentId={appointment.id}
                      currentStatus={appointment.status}
                      selectedDate={selectedDate}
                    />
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