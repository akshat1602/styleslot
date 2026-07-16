"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import {
  createAppointment,
  type CreateAppointmentState,
} from "@/app/actions/create-appointment";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/theme-toggle";

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

const initialState: CreateAppointmentState = {
  ok: false,
  message: "",
  fieldErrors: {},
};

export default function BookingForm({
  salonName,
  address,
  openTime,
  closeTime,
  services,
}: BookingFormProps) {
  const router = useRouter();

  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState("");

  const [state, formAction, pending] = useActionState(
    createAppointment,
    initialState,
  );

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId),
    [services, selectedServiceId],
  );

  const currentStep = useMemo(() => {
    if (!selectedServiceId) return 0;
    if (!selectedDate) return 1;
    if (!selectedSlot) return 2;
    if (!customerName.trim() || !customerPhone.trim()) return 3;
    return 4;
  }, [
    selectedServiceId,
    selectedDate,
    selectedSlot,
    customerName,
    customerPhone,
  ]);

  const currentStepLabel = useMemo(() => {
    switch (currentStep) {
      case 0:
        return "Choose a service";
      case 1:
        return "Pick a date";
      case 2:
        return "Select a time slot";
      case 3:
        return "Enter your details";
      case 4:
        return "Review and confirm";
      default:
        return "Choose a service";
    }
  }, [currentStep]);

  const progressPercent = useMemo(() => {
    if (!selectedServiceId) return 0;
    if (!selectedDate) return 25;
    if (!selectedSlot) return 50;
    if (!customerName.trim() || !customerPhone.trim()) return 75;
    return 100;
  }, [
    selectedServiceId,
    selectedDate,
    selectedSlot,
    customerName,
    customerPhone,
  ]);

  const serviceError = state.fieldErrors?.serviceId?.[0];
  const dateError = state.fieldErrors?.appointmentDate?.[0];
  const slotError = state.fieldErrors?.selectedSlot?.[0];
  const nameError = state.fieldErrors?.customerName?.[0];
  const phoneError = state.fieldErrors?.customerPhone?.[0];

  useEffect(() => {
    async function loadSlots() {
      if (!selectedServiceId || !selectedDate) {
        setSlots([]);
        setSelectedSlot("");
        setSlotsError("");
        return;
      }

      setSlotsLoading(true);
      setSlotsError("");
      setSelectedSlot("");

      try {
        const res = await fetch(
          `/api/slots?serviceId=${selectedServiceId}&date=${selectedDate}`,
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

    setSelectedServiceId("");
    setSelectedDate("");
    setSelectedSlot("");
    setCustomerName("");
    setCustomerPhone("");
    setSlots([]);
    setSlotsError("");

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
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start xl:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <div className="ui-hero-card overflow-hidden p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 pr-3">
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

                <div className="shrink-0 self-start">
                  <ThemeToggle />
                </div>
              </div>

              <div className="mt-6">
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
                  Choose a service, pick a date, and reserve your slot in a
                  few simple steps.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
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

            <div className="ui-card p-5 sm:p-6">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="text-left">
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
                    Review your booking details here.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div
                  className="flex h-full flex-col items-center rounded-2xl border p-4 text-center"
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
                    className="mt-2 text-sm font-semibold leading-6"
                    style={{ color: "var(--text)" }}
                  >
                    {selectedService?.name || "No service selected"}
                  </p>
                </div>

                <div
                  className="flex h-full flex-col items-center rounded-2xl border p-4 text-center"
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
                    className="mt-2 text-sm font-semibold leading-6"
                    style={{ color: "var(--text)" }}
                  >
                    {selectedService
                      ? `${selectedService.durationMin} min`
                      : "Select service first"}
                  </p>
                </div>

                <div
                  className="flex h-full flex-col items-center rounded-2xl border p-4 text-center"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-muted)",
                  }}
                >
                  <p
                    className="text-xs font-medium uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Price
                  </p>
                  <p
                    className="mt-2 text-base font-bold leading-6"
                    style={{ color: "var(--text)" }}
                  >
                    {selectedService ? `₹${selectedService.price}` : "Not selected"}
                  </p>
                </div>

                <div
                  className="flex h-full flex-col items-center rounded-2xl border p-4 text-center"
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
                    className="mt-2 text-sm font-semibold leading-6"
                    style={{ color: "var(--text)" }}
                  >
                    {selectedSlot && selectedDate
                      ? `${selectedDate} · ${selectedSlot}`
                      : "No slot selected"}
                  </p>
                </div>
              </div>
            </div>

            <div className="ui-card p-5 sm:p-6">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="text-left">
                  <h2
                    className="text-lg font-semibold sm:text-xl"
                    style={{ color: "var(--text)" }}
                  >
                    Booking notes
                  </h2>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    A few quick tips before you confirm.
                  </p>
                </div>

                <span
                  className="ui-pill"
                  style={{
                    background: "var(--surface-soft)",
                    color: "var(--text-muted)",
                  }}
                >
                  Quick tips
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div
                  className="flex h-full flex-col items-center rounded-2xl border p-4 text-center"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-muted)",
                  }}
                >
                  <p
                    className="text-xs font-medium uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Availability
                  </p>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--text)" }}
                  >
                    Pick a service and date to see open slots.
                  </p>
                </div>

                <div
                  className="flex h-full flex-col items-center rounded-2xl border p-4 text-center"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-muted)",
                  }}
                >
                  <p
                    className="text-xs font-medium uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Confirmation
                  </p>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--text)" }}
                  >
                    Your booking is confirmed after you submit your details.
                  </p>
                </div>

                <div
                  className="flex h-full flex-col items-center rounded-2xl border p-4 text-center"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-muted)",
                  }}
                >
                  <p
                    className="text-xs font-medium uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Arrival
                  </p>
                  <p
                    className="mt-2 text-sm leading-6"
                    style={{ color: "var(--text)" }}
                  >
                    Arrive a few minutes early for a smooth start.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="ui-card p-5 sm:p-6 lg:sticky lg:top-4">
            <div className="mb-6">
              <div
                className="rounded-2xl border p-4"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface-muted)",
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-[0.16em]"
                      style={{ color: "var(--text-soft)" }}
                    >
                      Booking progress
                    </p>
                    <p
                      className="mt-1 text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      Step {Math.min(currentStep + 1, 5)} of 5 ·{" "}
                      {currentStepLabel}
                    </p>
                  </div>

                  <span
                    className="ui-pill"
                    style={{
                      background: "var(--surface)",
                      color: "var(--text-muted)",
                      boxShadow: "inset 0 0 0 1px var(--border)",
                    }}
                  >
                    {progressPercent}%
                  </span>
                </div>

                <div
                  className="mt-4 h-2 overflow-hidden rounded-full"
                  style={{ background: "var(--surface-soft)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progressPercent}%`,
                      background: "var(--primary)",
                    }}
                  />
                </div>
              </div>

              <h2
                className="mt-5 text-xl font-semibold tracking-tight"
                style={{ color: "var(--text)" }}
              >
                Book your visit
              </h2>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--text-muted)" }}
              >
                Choose your service, date, slot, and contact details below.
              </p>
            </div>

            <form
              action={formAction}
              className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-2"
              noValidate
            >
              {!state.ok && state.message ? (
                <div
                  className="rounded-2xl border p-4 text-sm lg:col-span-2"
                  style={{
                    borderColor: "#e5c7c2",
                    background: "var(--danger-soft)",
                    color: "var(--danger)",
                  }}
                  aria-live="polite"
                >
                  {state.message}
                </div>
              ) : null}

              <div
                className="space-y-3 rounded-2xl border p-4 sm:p-5"
                style={{
                  borderColor: serviceError ? "var(--danger)" : "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Step 1
                  </p>
                  <h3
                    className="mt-1 text-base font-semibold sm:text-lg"
                    style={{ color: "var(--text)" }}
                  >
                    Choose a service
                  </h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Select what you want to book.
                  </p>
                </div>

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
                    aria-invalid={serviceError ? "true" : "false"}
                    aria-describedby={serviceError ? "service-error" : undefined}
                  >
                    <option value="">Choose a service</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} — {service.durationMin} min — ₹
                        {service.price}
                      </option>
                    ))}
                  </select>
                  {serviceError ? (
                    <p
                      id="service-error"
                      className="mt-2 text-sm"
                      style={{ color: "var(--danger)" }}
                    >
                      {serviceError}
                    </p>
                  ) : null}
                </div>
              </div>

              <div
                className="space-y-3 rounded-2xl border p-4 sm:p-5"
                style={{
                  borderColor: dateError ? "var(--danger)" : "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Step 2
                  </p>
                  <h3
                    className="mt-1 text-base font-semibold sm:text-lg"
                    style={{ color: "var(--text)" }}
                  >
                    Pick a date
                  </h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Choose your visit date.
                  </p>
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
                    aria-invalid={dateError ? "true" : "false"}
                    aria-describedby={dateError ? "date-error" : undefined}
                  />
                  {!selectedDate ? (
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No date selected.
                    </p>
                  ) : null}
                  {dateError ? (
                    <p
                      id="date-error"
                      className="mt-2 text-sm"
                      style={{ color: "var(--danger)" }}
                    >
                      {dateError}
                    </p>
                  ) : null}
                </div>
              </div>

              <div
                className="space-y-3 rounded-2xl border p-4 sm:p-5 lg:col-span-2"
                style={{
                  borderColor:
                    slotError || slotsError ? "var(--danger)" : "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Step 3
                  </p>
                  <h3
                    className="mt-1 text-base font-semibold sm:text-lg"
                    style={{ color: "var(--text)" }}
                  >
                    Select a time slot
                  </h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Pick an available time.
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Available slots
                    </p>
                    <span
                      className="ui-pill"
                      style={{
                        background: selectedSlot
                          ? "var(--primary)"
                          : "var(--surface)",
                        color: selectedSlot
                          ? "var(--primary-foreground)"
                          : "var(--text-muted)",
                        boxShadow: selectedSlot
                          ? "var(--shadow-sm)"
                          : "inset 0 0 0 1px var(--border)",
                      }}
                    >
                      {selectedSlot || "No slot selected"}
                    </span>
                  </div>

                  <div
                    className="rounded-2xl border p-4"
                    style={{
                      borderColor:
                        slotError || slotsError
                          ? "var(--danger)"
                          : "var(--border)",
                      background: "var(--surface-muted)",
                    }}
                    aria-describedby={slotError ? "slot-error" : undefined}
                  >
                    {!selectedServiceId || !selectedDate ? (
                      <div
                        className="rounded-2xl border p-5 text-sm"
                        style={{
                          borderStyle: "dashed",
                          borderColor: "var(--border-strong)",
                          background: "var(--surface)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Choose a service and date to view slots.
                      </div>
                    ) : slotsLoading ? (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, index) => (
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
                        No slots available for this date.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
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
                              aria-pressed={isSelected}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <input
                    type="hidden"
                    name="selectedSlot"
                    value={selectedSlot}
                  />

                  {slotError ? (
                    <p
                      id="slot-error"
                      className="mt-2 text-sm"
                      style={{ color: "var(--danger)" }}
                    >
                      {slotError}
                    </p>
                  ) : null}
                </div>
              </div>

              <div
                className="space-y-4 rounded-2xl border p-4 sm:p-5 lg:col-span-2 2xl:col-span-1"
                style={{
                  borderColor:
                    nameError || phoneError ? "var(--danger)" : "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Step 4
                  </p>
                  <h3
                    className="mt-1 text-base font-semibold sm:text-lg"
                    style={{ color: "var(--text)" }}
                  >
                    Enter your details
                  </h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Add your contact information.
                  </p>
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
                    aria-invalid={nameError ? "true" : "false"}
                    aria-describedby={nameError ? "name-error" : undefined}
                  />
                  {!customerName.trim() ? (
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Add your full name.
                    </p>
                  ) : null}
                  {nameError ? (
                    <p
                      id="name-error"
                      className="mt-2 text-sm"
                      style={{ color: "var(--danger)" }}
                    >
                      {nameError}
                    </p>
                  ) : null}
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
                    aria-invalid={phoneError ? "true" : "false"}
                    aria-describedby={phoneError ? "phone-error" : undefined}
                  />
                  {!customerPhone.trim() ? (
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Add a contact number.
                    </p>
                  ) : null}
                  {phoneError ? (
                    <p
                      id="phone-error"
                      className="mt-2 text-sm"
                      style={{ color: "var(--danger)" }}
                    >
                      {phoneError}
                    </p>
                  ) : null}
                </div>
              </div>

              <div
                className="space-y-4 rounded-2xl border p-4 sm:p-5 lg:col-span-2 2xl:col-span-1"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--text-soft)" }}
                  >
                    Step 5
                  </p>
                  <h3
                    className="mt-1 text-base font-semibold sm:text-lg"
                    style={{ color: "var(--text)" }}
                  >
                    Review and confirm
                  </h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Check everything before you submit.
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
                    className="text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    Review details
                  </p>
                  <div
                    className="mt-2 space-y-1 text-sm"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <p>
                      {selectedService
                        ? `${selectedService.name} · ${selectedService.durationMin} min · ₹${selectedService.price}`
                        : "No service selected."}
                    </p>
                    <p>
                      {selectedSlot && selectedDate
                        ? `${selectedDate} at ${selectedSlot}`
                        : "No time slot selected."}
                    </p>
                    <p>
                      {customerName.trim()
                        ? `Name: ${customerName}`
                        : "Name not added."}
                    </p>
                    <p>
                      {customerPhone.trim()
                        ? `Phone: ${customerPhone}`
                        : "Phone not added."}
                    </p>
                  </div>
                </div>

                {state.ok && state.message ? (
                  <div
                    className="rounded-2xl border p-4 text-sm"
                    style={{
                      borderColor: "#c9dcc4",
                      background: "var(--success-soft)",
                      color: "var(--success)",
                    }}
                    aria-live="polite"
                  >
                    {state.message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={
                    pending ||
                    !selectedServiceId ||
                    !selectedDate ||
                    !selectedSlot ||
                    !customerName.trim() ||
                    !customerPhone.trim()
                  }
                  className="ui-btn ui-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? "Booking..." : "Confirm booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}