"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { createAppointment } from "@/app/actions/create-appointment";
import { useRouter } from "next/navigation";

type ServiceItem = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};

type BookingFormProps = {
  salonName: string;
  address: string | null;
  openTime: string;
  closeTime: string;
  services: ServiceItem[];
};

type SlotsResponse = {
  availableSlots: string[];
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const initialState = {
  ok: false,
  message: "",
};

export default function BookingForm({
  salonName,
  address,
  openTime,
  closeTime,
  services,
}: BookingFormProps) {
  const router = useRouter();

  const [selectedServiceId, setSelectedServiceId] = useState(
    services[0]?.id ?? ""
  );
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [selectedSlot, setSelectedSlot] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [state, formAction, pending] = useActionState(
    createAppointment,
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
      setSelectedSlot("");

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
        setSlots(slotData.availableSlots);
      } catch {
        setSlots([]);
        setSlotsError("Failed to load slots.");
      } finally {
        setSlotsLoading(false);
      }
    }

    loadSlots();
  }, [selectedServiceId, selectedDate]);

  useEffect(() => {
    if (!state.ok || !selectedService || !selectedSlot) {
      return;
    }

    const params = new URLSearchParams({
      date: selectedDate,
      slot: selectedSlot,
      service: selectedService.name,
      name: customerName,
    });

    setSelectedSlot("");
    setCustomerName("");
    setCustomerPhone("");

    router.push(`/booking-success?${params.toString()}`);
  }, [
    state.ok,
    selectedDate,
    selectedSlot,
    selectedService,
    customerName,
    router,
  ]);

  return (
    <main className="ui-shell">
      <section className="ui-container py-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-6">
            <div className="ui-hero-card overflow-hidden p-6 sm:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="ui-pill"
                      style={{
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      Online booking
                    </span>
                    <span
                      className="ui-pill"
                      style={{
                        background: "var(--surface)",
                        color: "var(--text-muted)",
                        boxShadow: "inset 0 0 0 1px var(--border)",
                      }}
                    >
                      Fast confirmation
                    </span>
                  </div>
                </div>

                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Book your appointment
                  </p>
                  <h1
                    className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl"
                    style={{ color: "var(--text)" }}
                  >
                    {salonName}
                  </h1>
                  <p
                    className="mt-4 max-w-2xl text-sm leading-6 sm:text-base"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Choose your service, pick a date, and reserve a time slot in
                    a few steps. The booking flow is designed to stay quick,
                    clear, and mobile-friendly.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="ui-card-soft p-4">
                    <p
                      className="text-xs font-medium uppercase tracking-[0.16em]"
                      style={{ color: "var(--text-soft)" }}
                    >
                      Address
                    </p>
                    <p
                      className="mt-2 text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {address || "Address not added yet"}
                    </p>
                  </div>

                  <div className="ui-card-soft p-4">
                    <p
                      className="text-xs font-medium uppercase tracking-[0.16em]"
                      style={{ color: "var(--text-soft)" }}
                    >
                      Working hours
                    </p>
                    <p
                      className="mt-2 text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {openTime} to {closeTime}
                    </p>
                  </div>

                  <div className="ui-card-soft p-4">
                    <p
                      className="text-xs font-medium uppercase tracking-[0.16em]"
                      style={{ color: "var(--text-soft)" }}
                    >
                      Active services
                    </p>
                    <p
                      className="mt-2 text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {services.length} available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ui-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2
                    className="text-lg font-semibold sm:text-xl"
                    style={{ color: "var(--text)" }}
                  >
                    Service summary
                  </h2>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Review what you&apos;re booking before confirming.
                  </p>
                </div>

                {selectedService ? (
                  <span
                    className="ui-pill"
                    style={{
                      background: "var(--surface-soft)",
                      color: "var(--text-muted)",
                    }}
                  >
                    ₹{selectedService.price}
                  </span>
                ) : null}
              </div>

              {selectedService ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface-muted)",
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-[0.16em]"
                      style={{ color: "var(--text-soft)" }}
                    >
                      Service
                    </p>
                    <p
                      className="mt-2 text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {selectedService.name}
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface-muted)",
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-[0.16em]"
                      style={{ color: "var(--text-soft)" }}
                    >
                      Duration
                    </p>
                    <p
                      className="mt-2 text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {selectedService.durationMin} min
                    </p>
                  </div>

                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface-muted)",
                    }}
                  >
                    <p
                      className="text-xs font-medium uppercase tracking-[0.16em]"
                      style={{ color: "var(--text-soft)" }}
                    >
                      Slot
                    </p>
                    <p
                      className="mt-2 text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      {selectedSlot
                        ? `${selectedDate} · ${selectedSlot}`
                        : "Not selected"}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="mt-5 rounded-2xl border p-5 text-sm"
                  style={{
                    borderStyle: "dashed",
                    borderColor: "var(--border-strong)",
                    background: "var(--surface-muted)",
                    color: "var(--text-muted)",
                  }}
                >
                  Select a service to see booking details.
                </div>
              )}
            </div>
          </div>

          <div className="ui-card p-5 sm:p-6 lg:sticky lg:top-6">
            <div className="mb-6">
              <h2
                className="text-xl font-semibold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                Complete your booking
              </h2>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--text-muted)" }}
              >
                Pick a service, select a date, choose an available slot, and add
                your contact details.
              </p>
            </div>

            <form action={formAction} className="space-y-5">
              <div>
                <label htmlFor="service" className="ui-label">
                  Select service
                </label>
                <select
                  id="service"
                  name="serviceId"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="ui-input"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} — {service.durationMin} min — ₹
                      {service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="ui-label">
                  Select date
                </label>
                <input
                  id="date"
                  name="appointmentDate"
                  type="date"
                  min={getTodayDate()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="ui-input"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Available slots
                  </p>
                  {selectedSlot ? (
                    <span
                      className="ui-pill"
                      style={{
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      {selectedSlot}
                    </span>
                  ) : null}
                </div>

                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-muted)",
                  }}
                >
                  {slotsLoading ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-11 animate-pulse rounded-xl"
                          style={{ background: "var(--surface-soft)" }}
                        />
                      ))}
                    </div>
                  ) : slotsError ? (
                    <div
                      className="rounded-2xl border p-4"
                      style={{
                        borderColor: "#e5c7c2",
                        background: "var(--danger-soft)",
                      }}
                    >
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--danger)" }}
                      >
                        {slotsError}
                      </p>
                    </div>
                  ) : slots.length === 0 ? (
                    <div
                      className="rounded-2xl border p-5 text-sm"
                      style={{
                        borderStyle: "dashed",
                        borderColor: "var(--border-strong)",
                        background: "var(--surface)",
                        color: "var(--text-muted)",
                      }}
                    >
                      No slots available for this date. Try another date or
                      service.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {slots.map((slot) => {
                        const isSelected = selectedSlot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className="rounded-2xl border px-3 py-3 text-sm font-medium transition"
                            style={
                              isSelected
                                ? {
                                    borderColor: "var(--primary)",
                                    background: "var(--primary)",
                                    color: "var(--primary-foreground)",
                                    boxShadow: "var(--shadow-sm)",
                                  }
                                : {
                                    borderColor: "var(--border)",
                                    background: "var(--surface)",
                                    color: "var(--text-muted)",
                                  }
                            }
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <input type="hidden" name="selectedSlot" value={selectedSlot} />
              </div>

              <div>
                <label htmlFor="name" className="ui-label">
                  Your name
                </label>
                <input
                  id="name"
                  name="customerName"
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="ui-input"
                />
              </div>

              <div>
                <label htmlFor="phone" className="ui-label">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="customerPhone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="ui-input"
                />
              </div>

              {selectedService ? (
                <div
                  className="rounded-2xl border p-4"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-muted)",
                  }}
                >
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Booking details
                  </p>
                  <div
                    className="mt-2 space-y-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <p>
                      {selectedService.name} · {selectedService.durationMin} min
                      · ₹{selectedService.price}
                    </p>
                    <p>
                      {selectedSlot
                        ? `Chosen slot: ${selectedDate} at ${selectedSlot}`
                        : "Choose a slot to continue."}
                    </p>
                  </div>
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
                {pending ? "Booking..." : "Confirm appointment"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}