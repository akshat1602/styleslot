"use client";

import { useActionState } from "react";
import type { ServiceActionState } from "@/app/dashboard/services/actions";

type ServiceFormProps = {
  action: (
    prevState: ServiceActionState,
    formData: FormData
  ) => Promise<ServiceActionState>;
  submitLabel: string;
  initialValues?: {
    id?: string;
    name: string;
    durationMin: number;
    price: number;
  };
};

const initialState: ServiceActionState = {
  ok: false,
  message: "",
};

export default function ServiceForm({
  action,
  submitLabel,
  initialValues,
}: ServiceFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const isEditing = Boolean(initialValues?.id);

  return (
    <form action={formAction} className="space-y-6">
      {initialValues?.id ? (
        <input type="hidden" name="serviceId" value={initialValues.id} />
      ) : null}

      <div className="grid gap-5">
        <div>
          <label htmlFor="name" className="ui-label">
            Service name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={initialValues?.name ?? ""}
            placeholder="Haircut"
            className="ui-input"
          />
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            Choose a short, customer-friendly name that is easy to understand at
            a glance.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="durationMin" className="ui-label">
              Duration in minutes
            </label>
            <input
              id="durationMin"
              name="durationMin"
              type="number"
              min="5"
              step="5"
              defaultValue={initialValues?.durationMin ?? 30}
              className="ui-input"
            />
            <p className="mt-2 text-xs leading-5 text-neutral-500">
              Use realistic timing so booking slots are generated correctly.
            </p>
          </div>

          <div>
            <label htmlFor="price" className="ui-label">
              Price
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="1"
              defaultValue={initialValues?.price ?? 0}
              className="ui-input"
            />
            <p className="mt-2 text-xs leading-5 text-neutral-500">
              Enter the amount customers should see while booking this service.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm font-medium text-neutral-900">
            {isEditing ? "Editing service" : "Before you save"}
          </p>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Double-check the name, duration, and price. These values affect what
            customers see during booking and what appears in dashboard reports.
          </p>
        </div>

        {state.message ? (
          <div
            className={`rounded-2xl border p-4 text-sm ${
              state.ok
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-neutral-200 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            {pending
              ? "Saving your changes..."
              : isEditing
              ? "Update the service when you're ready."
              : "Create the service when you're ready."}
          </p>

          <button
            type="submit"
            disabled={pending}
            className="ui-btn ui-btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}