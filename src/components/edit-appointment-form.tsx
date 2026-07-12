"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { updateAppointment } from "@/app/dashboard/appointments/[id]/edit/actions";

type ServiceItem = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};

type SlotsResponse = {
  availableSlots: string[];
};

type EditAppointmentFormProps = {
  appointmentId: string;
  customerName: string;
  customerPhone: string;
  initialServiceId: string;
  initialDate: string;
  initialTime: string;
  services: ServiceItem[];
  backDate: string;
};

const initialState = {
  ok: false,
  message: "",
};

export default function EditAppointmentForm({
  appointmentId,
  customerName,
  customerPhone,
  initialServiceId,
  initialDate,
  initialTime,
  services,
  backDate,
}: EditAppointmentFormProps) {
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlot, setSelectedSlot] = useState(initialTime);

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [state, formAction, pending] = useActionState(
    updateAppointment,
    initialState
  );

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [services, selectedServiceId]
  );

  useEffect(() => {
    async function loadSlots() {
      if (!selectedServiceId || !selectedDate) {
        setSlots([]);
        setSelectedSlot("");
        return;
      }

      setSlotsLoading(true);
      setSlotsError("");

      try {
        const res = await fetch(
          `/api/slots?serviceId=${selectedServiceId}&date=${selectedDate}`
        );

        const data = await res.json();

        if (!res.ok) {
          setSlots([]);
          setSlotsError(data.error || "Failed to load slots.");
          return;
        }

        const slotData = data as SlotsResponse;

        const shouldIncludeInitialTime =
          selectedDate === initialDate &&
          selectedServiceId === initialServiceId;

        const mergedSlots =
          shouldIncludeInitialTime && !slotData.availableSlots.includes(initialTime)
            ? [initialTime, ...slotData.availableSlots]
            : slotData.availableSlots;

        const uniqueSlots = Array.from(new Set(mergedSlots)).sort();

        setSlots(uniqueSlots);

        setSelectedSlot((currentSelectedSlot) => {
          if (uniqueSlots.includes(currentSelectedSlot)) {
            return currentSelectedSlot;
          }

          if (shouldIncludeInitialTime && uniqueSlots.includes(initialTime)) {
            return initialTime;
          }

          return "";
        });
      } catch {
        setSlots([]);
        setSlotsError("Failed to load slots.");
      } finally {
        setSlotsLoading(false);
      }
    }

    loadSlots();
  }, [selectedServiceId, selectedDate, initialDate, initialServiceId, initialTime]);

  return (
    <form
      action={formAction}
      className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200"
    >
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <input type="hidden" name="customerName" value={customerName} />
      <input type="hidden" name="customerPhone" value={customerPhone} />
      <input type="hidden" name="backDate" value={backDate} />

      <div className="space-y-5">
        <div>
          <label
            htmlFor="serviceId"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Select service
          </label>
          <select
            id="serviceId"
            name="serviceId"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — {service.durationMin} min — ₹{service.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="appointmentDate"
            className="mb-2 block text-sm font-medium text-neutral-700"
          >
            Select date
          </label>
          <input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <div>
          <p className="mb-2 block text-sm font-medium text-neutral-700">
            Available slots
          </p>

          {slotsLoading ? (
            <p className="text-sm text-neutral-500">Loading slots...</p>
          ) : slotsError ? (
            <p className="text-sm text-red-600">{slotsError}</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No slots available for this date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                    selectedSlot === slot
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-700"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}

          <input type="hidden" name="selectedSlot" value={selectedSlot} />
        </div>

        {selectedService ? (
          <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200">
            <p className="text-sm font-medium text-neutral-800">
              Updated appointment preview
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              {selectedService.name} · {selectedService.durationMin} min · ₹
              {selectedService.price}
            </p>
            {selectedSlot ? (
              <p className="mt-1 text-sm text-neutral-600">
                New slot: {selectedDate} at {selectedSlot}
              </p>
            ) : null}
          </div>
        ) : null}

        {state.message ? (
          <p
            className={`text-sm ${
              state.ok ? "text-green-600" : "text-red-600"
            }`}
          >
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending || !selectedSlot}
          className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          {pending ? "Saving..." : "Save reschedule"}
        </button>
      </div>
    </form>
  );
}