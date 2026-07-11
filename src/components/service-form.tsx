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

  return (
    <form
      action={formAction}
      className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200"
    >
      {initialValues?.id ? (
        <input type="hidden" name="serviceId" value={initialValues.id} />
      ) : null}

      <div className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Service name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={initialValues?.name ?? ""}
            placeholder="Haircut"
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <div>
          <label
            htmlFor="durationMin"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Duration in minutes
          </label>
          <input
            id="durationMin"
            name="durationMin"
            type="number"
            min="5"
            step="5"
            defaultValue={initialValues?.durationMin ?? 30}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            defaultValue={initialValues?.price ?? 0}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        {state.message ? (
          <p
            className={`text-sm ${state.ok ? "text-green-600" : "text-red-600"}`}
          >
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}