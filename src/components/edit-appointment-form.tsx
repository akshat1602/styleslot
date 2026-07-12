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
    <form action={formAction} className="ui-card mt-6 p-6">
      <input type="hidden" name="appointmentId" value={appointmentId} />
      <input type="hidden" name="customerName" value={customerName} />
      <input type="hidden" name="customerPhone" value={customerPhone} />
      <input type="hidden" name="backDate" value={backDate} />

      <div className="space-y-5">
        <div>
          <label htmlFor="serviceId" className="ui-label">
            Select service
          </label>
          <select
            id="serviceId"
            name="serviceId"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
            className="ui-input"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — {service.durationMin} min — ₹{service.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="appointmentDate" className="ui-label">
            Select date
          </label>
          <input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="ui-input"
          />
        </div>

        <div>
          <p className="ui-label mb-2">Available slots</p>

          {slotsLoading ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Loading slots...
            </p>
          ) : slotsError ? (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {slotsError}
            </p>
          ) : slots.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No slots available for this date.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className="rounded-xl px-3 py-2 text-sm font-medium transition"
                    style={
                      isSelected
                        ? {
                            background: "var(--primary)",
                            color: "var(--primary-foreground)",
                            border: "1px solid var(--primary)",
                            boxShadow: "var(--shadow-sm)",
                          }
                        : {
                            background: "var(--surface)",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border-strong)",
                          }
                    }
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}

          <input type="hidden" name="selectedSlot" value={selectedSlot} />
        </div>

        {selectedService ? (
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--surface-muted)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Updated appointment preview
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {selectedService.name} · {selectedService.durationMin} min · ₹
              {selectedService.price}
            </p>
            {selectedSlot ? (
              <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                New slot: {selectedDate} at {selectedSlot}
              </p>
            ) : null}
          </div>
        ) : null}

        {state.message ? (
          <div
            className="rounded-2xl border p-4 text-sm"
            style={
              state.ok
                ? {
                    borderColor: "#c9dcc4",
                    background: "var(--success-soft)",
                    color: "var(--success)",
                  }
                : {
                    borderColor: "#e5c7c2",
                    background: "var(--danger-soft)",
                    color: "var(--danger)",
                  }
            }
          >
            {state.message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={pending || !selectedSlot}
          className="ui-btn ui-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save reschedule"}
        </button>
      </div>
    </form>
  );
}