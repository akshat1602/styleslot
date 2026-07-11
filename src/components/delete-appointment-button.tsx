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
        className="rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}