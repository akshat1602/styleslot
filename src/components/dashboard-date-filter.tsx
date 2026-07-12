"use client";

export default function DashboardDateFilter({
  selectedDate,
}: {
  selectedDate: string;
}) {
  return (
    <form className="flex flex-col gap-2 sm:w-56">
      <label htmlFor="date" className="ui-label mb-0">
        Select date
      </label>
      <input
        id="date"
        name="date"
        type="date"
        defaultValue={selectedDate}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="ui-input"
      />
    </form>
  );
}