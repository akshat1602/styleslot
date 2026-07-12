"use client";

export default function DashboardDateFilter({
  selectedDate,
}: {
  selectedDate: string;
}) {
  return (
    <form className="flex flex-col gap-2 sm:w-56">
      <label
        htmlFor="date"
        className="text-sm font-medium text-neutral-700"
      >
        Select date
      </label>
      <input
        id="date"
        name="date"
        type="date"
        defaultValue={selectedDate}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
      />
    </form>
  );
}