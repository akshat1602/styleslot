"use client";

type DeleteAppointmentButtonProps = {
  appointmentId: string;
  selectedDate: string;
  action: (formData: FormData) => void | Promise<void>;
};

export default function DeleteAppointmentButton({
  appointmentId,
  selectedDate,
  action,
}: DeleteAppointmentButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this appointment?"
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <input type="hidden" name="date" value={selectedDate} />
      <button
        type="submit"
        className="rounded-xl border px-3 py-2 text-xs font-medium transition"
        style={{
          borderColor: "#d8a9a2",
          background: "var(--surface)",
          color: "var(--danger)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--danger-soft)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--surface)";
        }}
      >
        Delete
      </button>
    </form>
  );
}