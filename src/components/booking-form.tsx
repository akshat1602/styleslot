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
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ui-pill bg-neutral-900 text-white">
                    Online booking
                  </span>
                  <span className="ui-pill bg-white text-neutral-600 ring-1 ring-neutral-200">
                    Fast confirmation
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-500">
                    Book your appointment
                  </p>
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl">
                    {salonName}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                    Choose your service, pick a date, and reserve a time slot in
                    a few steps. The booking flow is designed to stay quick,
                    clear, and mobile-friendly.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="ui-card-soft p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                      Address
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-900">
                      {address || "Address not added yet"}
                    </p>
                  </div>

                  <div className="ui-card-soft p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                      Working hours
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-900">
                      {openTime} to {closeTime}
                    </p>
                  </div>

                  <div className="ui-card-soft p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                      Active services
                    </p>
                    <p className="mt-2 text-sm font-medium text-neutral-900">
                      {services.length} available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="ui-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 sm:text-xl">
                    Service summary
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    Review what you&apos;re booking before confirming.
                  </p>
                </div>

                {selectedService ? (
                  <span className="ui-pill bg-neutral-100 text-neutral-700">
                    ₹{selectedService.price}
                  </span>
                ) : null}
              </div>

              {selectedService ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                      Service
                    </p>
                    <p className="mt-2 text-sm font-semibold text-neutral-900">
                      {selectedService.name}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                      Duration
                    </p>
                    <p className="mt-2 text-sm font-semibold text-neutral-900">
                      {selectedService.durationMin} min
                    </p>
                  </div>

                  <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                      Slot
                    </p>
                    <p className="mt-2 text-sm font-semibold text-neutral-900">
                      {selectedSlot ? `${selectedDate} · ${selectedSlot}` : "Not selected"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-sm text-neutral-500">
                  Select a service to see booking details.
                </div>
              )}
            </div>
          </div>

          <div className="ui-card p-5 sm:p-6 lg:sticky lg:top-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                Complete your booking
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
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
                      {service.name} — {service.durationMin} min — ₹{service.price}
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
                  <p className="text-sm font-medium text-neutral-700">
                    Available slots
                  </p>
                  {selectedSlot ? (
                    <span className="ui-pill bg-neutral-900 text-white">
                      {selectedSlot}
                    </span>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  {slotsLoading ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-11 animate-pulse rounded-xl bg-neutral-200"
                        />
                      ))}
                    </div>
                  ) : slotsError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-700">
                        {slotsError}
                      </p>
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-5 text-sm text-neutral-500">
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
                            className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                              isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
                                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100"
                            }`}
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
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-medium text-neutral-800">
                    Booking details
                  </p>
                  <div className="mt-2 space-y-1 text-sm text-neutral-600">
                    <p>
                      {selectedService.name} · {selectedService.durationMin} min · ₹
                      {selectedService.price}
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
                  className={`rounded-2xl border p-4 text-sm ${
                    state.ok
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
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