import Link from "next/link";
import { format, subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { updateAppointmentStatus, deleteAppointment } from "./actions";
import { logoutAdmin } from "@/app/login/actions";
import DashboardDateFilter from "@/components/dashboard-date-filter";
import DeleteAppointmentButton from "@/components/delete-appointment-button";

type DashboardPageProps = {
  searchParams?: Promise<{
    date?: string;
    status?: string;
    query?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 5;

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

function buildDashboardHref({
  date,
  status,
  query,
  page,
}: {
  date: string;
  status?: string;
  query?: string;
  page?: number;
}) {
  const params = new URLSearchParams();
  params.set("date", date);

  if (status && status !== "ALL") {
    params.set("status", status);
  }

  if (query && query.trim()) {
    params.set("query", query.trim());
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  return `/dashboard?${params.toString()}`;
}

function StatusFilterLinks({
  selectedDate,
  selectedStatus,
  searchQuery,
}: {
  selectedDate: string;
  selectedStatus: string;
  searchQuery: string;
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

        const href = buildDashboardHref({
          date: selectedDate,
          status: filter.value,
          query: searchQuery,
          page: 1,
        });

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

function SearchForm({
  selectedDate,
  selectedStatus,
  searchQuery,
}: {
  selectedDate: string;
  selectedStatus: string;
  searchQuery: string;
}) {
  return (
    <form
      action="/dashboard"
      method="GET"
      className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200 sm:flex-row sm:items-center"
    >
      <input type="hidden" name="date" value={selectedDate} />
      {selectedStatus !== "ALL" ? (
        <input type="hidden" name="status" value={selectedStatus} />
      ) : null}

      <input
        type="text"
        name="query"
        defaultValue={searchQuery}
        placeholder="Search customer, phone, or service"
        className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Search
        </button>

        <Link
          href={buildDashboardHref({
            date: selectedDate,
            status: selectedStatus,
            page: 1,
          })}
          className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
        >
          Clear
        </Link>
      </div>
    </form>
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

function AnalyticsCards({
  totalServices,
  activeServices,
  weeklyAppointments,
  weeklyCompletedRevenue,
}: {
  totalServices: number;
  activeServices: number;
  weeklyAppointments: number;
  weeklyCompletedRevenue: number;
}) {
  const cards = [
    {
      label: "Total services",
      value: totalServices,
    },
    {
      label: "Active services",
      value: activeServices,
    },
    {
      label: "Last 7 days bookings",
      value: weeklyAppointments,
    },
    {
      label: "Last 7 days revenue",
      value: `₹${weeklyCompletedRevenue}`,
    },
  ];

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

      <DeleteAppointmentButton
        appointmentId={appointmentId}
        selectedDate={selectedDate}
        action={deleteAppointment}
      />
    </div>
  );
}

function PaginationControls({
  selectedDate,
  selectedStatus,
  searchQuery,
  currentPage,
  totalPages,
}: {
  selectedDate: string;
  selectedStatus: string;
  searchQuery: string;
  currentPage: number;
  totalPages: number;
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-neutral-200 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-600">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>

      <div className="flex gap-2">
        <Link
          href={buildDashboardHref({
            date: selectedDate,
            status: selectedStatus,
            query: searchQuery,
            page: currentPage - 1,
          })}
          aria-disabled={currentPage === 1}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            currentPage === 1
              ? "pointer-events-none bg-neutral-100 text-neutral-400"
              : "bg-neutral-900 text-white hover:bg-neutral-800"
          }`}
        >
          Previous
        </Link>

        <Link
          href={buildDashboardHref({
            date: selectedDate,
            status: selectedStatus,
            query: searchQuery,
            page: currentPage + 1,
          })}
          aria-disabled={currentPage === totalPages}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
            currentPage === totalPages
              ? "pointer-events-none bg-neutral-100 text-neutral-400"
              : "bg-neutral-900 text-white hover:bg-neutral-800"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

function TopServicesPanel({
  items,
}: {
  items: {
    id: string;
    name: string;
    totalBookings: number;
    completedBookings: number;
    revenue: number;
  }[];
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Popular services
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Based on bookings in the last 7 days.
          </p>
        </div>

        <Link
          href="/dashboard/services"
          className="text-sm font-medium text-neutral-700 underline underline-offset-4"
        >
          View services
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">
          No recent service activity found.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((service) => (
            <div
              key={service.id}
              className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {service.name}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {service.totalBookings} booking
                    {service.totalBookings === 1 ? "" : "s"} ·{" "}
                    {service.completedBookings} completed
                  </p>
                </div>

                <p className="text-sm font-medium text-neutral-900">
                  ₹{service.revenue}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RevenueBreakdownPanel({
  items,
}: {
  items: {
    date: string;
    revenue: number;
    completedCount: number;
  }[];
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900">
        Revenue breakdown
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        Completed appointment revenue over the last 7 days.
      </p>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">
          No completed appointment revenue found.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div
              key={item.date}
              className="flex items-center justify-between rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {item.date}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {item.completedCount} completed appointment
                  {item.completedCount === 1 ? "" : "s"}
                </p>
              </div>

              <p className="text-sm font-semibold text-neutral-900">
                ₹{item.revenue}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentAppointmentsPanel({
  items,
}: {
  items: {
    id: string;
    customerName: string;
    customerPhone: string;
    status: string;
    startTime: Date;
    service: {
      name: string;
    };
  }[];
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
      <h2 className="text-lg font-semibold text-neutral-900">
        Recent appointments
      </h2>
      <p className="mt-1 text-sm text-neutral-500">
        Latest bookings across all dates.
      </p>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">
          No appointments found.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {appointment.customerName}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {appointment.service.name} · {appointment.customerPhone}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {format(appointment.startTime, "dd MMM yyyy, hh:mm a")}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const resolvedSearchParams = await searchParams;

  const selectedDate = resolvedSearchParams?.date || getTodayDate();
  const searchQuery = resolvedSearchParams?.query?.trim() || "";

  const rawStatus = resolvedSearchParams?.status || "ALL";
  const selectedStatus =
    rawStatus === "BOOKED" ||
    rawStatus === "COMPLETED" ||
    rawStatus === "CANCELLED"
      ? rawStatus
      : "ALL";

  const rawPage = Number(resolvedSearchParams?.page || "1");
  const currentPage = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;

  const { startOfDay, endOfDay } = getDayRange(selectedDate);

  const last7DaysStart = new Date();
  last7DaysStart.setHours(0, 0, 0, 0);
  last7DaysStart.setDate(last7DaysStart.getDate() - 6);

  const [
    allAppointmentsForDay,
    allServices,
    weeklyAppointments,
    recentAppointments,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
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
      orderBy: {
        startTime: "asc",
      },
    }),
    prisma.service.findMany({
      orderBy: {
        name: "asc",
      },
    }),
    prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: last7DaysStart,
        },
      },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        appointmentDate: "asc",
      },
    }),
    prisma.appointment.findMany({
      include: {
        service: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  const filteredAppointments = allAppointmentsForDay.filter((appointment) => {
    const matchesStatus =
      selectedStatus === "ALL" || appointment.status === selectedStatus;

    const normalizedQuery = searchQuery.toLowerCase();

    const matchesQuery =
      !normalizedQuery ||
      appointment.customerName.toLowerCase().includes(normalizedQuery) ||
      appointment.customerPhone.toLowerCase().includes(normalizedQuery) ||
      appointment.service.name.toLowerCase().includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  const totalFilteredAppointments = filteredAppointments.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalFilteredAppointments / PAGE_SIZE)
  );
  const safeCurrentPage = currentPage > totalPages ? totalPages : currentPage;

  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const appointments = filteredAppointments.slice(startIndex, endIndex);

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

  const totalServices = allServices.length;
  const activeServices = allServices.filter((service) => service.isActive).length;
  const weeklyAppointmentsCount = weeklyAppointments.length;
  const weeklyCompletedRevenue = weeklyAppointments
    .filter((appointment) => appointment.status === "COMPLETED")
    .reduce((sum, appointment) => sum + appointment.service.price, 0);

  const topServicesMap = new Map<
    string,
    {
      id: string;
      name: string;
      totalBookings: number;
      completedBookings: number;
      revenue: number;
    }
  >();

  for (const appointment of weeklyAppointments) {
    const existing = topServicesMap.get(appointment.service.id);

    if (existing) {
      existing.totalBookings += 1;
      if (appointment.status === "COMPLETED") {
        existing.completedBookings += 1;
        existing.revenue += appointment.service.price;
      }
    } else {
      topServicesMap.set(appointment.service.id, {
        id: appointment.service.id,
        name: appointment.service.name,
        totalBookings: 1,
        completedBookings: appointment.status === "COMPLETED" ? 1 : 0,
        revenue:
          appointment.status === "COMPLETED" ? appointment.service.price : 0,
      });
    }
  }

  const topServices = Array.from(topServicesMap.values())
    .sort((a, b) => {
      if (b.totalBookings !== a.totalBookings) {
        return b.totalBookings - a.totalBookings;
      }

      return b.revenue - a.revenue;
    })
    .slice(0, 5);

  const revenueByDay = Array.from({ length: 7 }, (_, index) => {
    const date = subDays(new Date(), 6 - index);
    const key = format(date, "yyyy-MM-dd");

    const completedForDay = weeklyAppointments.filter(
      (appointment) =>
        format(appointment.appointmentDate, "yyyy-MM-dd") === key &&
        appointment.status === "COMPLETED"
    );

    return {
      date: key,
      revenue: completedForDay.reduce(
        (sum, appointment) => sum + appointment.service.price,
        0
      ),
      completedCount: completedForDay.length,
    };
  });

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
              View operations and business insights in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <DashboardDateFilter selectedDate={selectedDate} />

            <Link
              href="/dashboard/services"
              className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Manage services
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

        <SummaryCards
          totalAppointments={totalAppointments}
          bookedCount={bookedCount}
          completedCount={completedCount}
          cancelledCount={cancelledCount}
          completedRevenue={completedRevenue}
        />

        <AnalyticsCards
          totalServices={totalServices}
          activeServices={activeServices}
          weeklyAppointments={weeklyAppointmentsCount}
          weeklyCompletedRevenue={weeklyCompletedRevenue}
        />

        <div className="mb-6 grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-1">
            <TopServicesPanel items={topServices} />
          </div>

          <div className="xl:col-span-1">
            <RevenueBreakdownPanel items={revenueByDay} />
          </div>

          <div className="xl:col-span-1">
            <RecentAppointmentsPanel items={recentAppointments} />
          </div>
        </div>

        <div className="mb-6">
          <SearchForm
            selectedDate={selectedDate}
            selectedStatus={selectedStatus}
            searchQuery={searchQuery}
          />
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-600">
            Showing{" "}
            <span className="font-medium">
              {totalFilteredAppointments === 0 ? 0 : startIndex + 1}
            </span>
            -
            <span className="font-medium">
              {Math.min(endIndex, totalFilteredAppointments)}
            </span>{" "}
            of <span className="font-medium">{totalFilteredAppointments}</span>{" "}
            appointment
            {totalFilteredAppointments === 1 ? "" : "s"} on{" "}
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
            {searchQuery ? (
              <>
                {" "}
                · <span className="font-medium">Search:</span> "{searchQuery}"
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
            searchQuery={searchQuery}
          />
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-neutral-200">
            <h2 className="text-lg font-semibold">No appointments found</h2>
            <p className="mt-2 text-sm text-neutral-500">
              No bookings match the current date, status, and search filters.
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
                      <span className="font-medium text-neutral-800">
                        Phone:
                      </span>{" "}
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

            <PaginationControls
              selectedDate={selectedDate}
              selectedStatus={selectedStatus}
              searchQuery={searchQuery}
              currentPage={safeCurrentPage}
              totalPages={totalPages}
            />
          </>
        )}
      </section>
    </main>
  );
}