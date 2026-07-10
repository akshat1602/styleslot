"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { createAppointment } from "@/app/actions/create-appointment";

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

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
          <p className="mb-2 text-sm font-medium text-neutral-500">
            Book your appointment
          </p>
          <h1 className="text-3xl font-bold tracking-tight">{salonName}</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {address || "Address not added yet"}
          </p>
          <p className="mt-2 text-sm text-neutral-600">
            Hours: {openTime} to {closeTime}
          </p>
        </div>

        <form
          action={formAction}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="service"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Select service
              </label>
              <select
                id="service"
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
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Select date
              </label>
              <input
                id="date"
                name="appointmentDate"
                type="date"
                min={getTodayDate()}
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

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Your name
              </label>
              <input
                id="name"
                name="customerName"
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Phone number
              </label>
              <input
                id="phone"
                name="customerPhone"
                type="tel"
                placeholder="Enter phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
              />
            </div>

            {selectedService ? (
              <div className="rounded-xl bg-neutral-50 p-4 ring-1 ring-neutral-200">
                <p className="text-sm font-medium text-neutral-800">
                  Selected service
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {selectedService.name} · {selectedService.durationMin} min · ₹
                  {selectedService.price}
                </p>
                {selectedSlot ? (
                  <p className="mt-1 text-sm text-neutral-600">
                    Chosen slot: {selectedDate} at {selectedSlot}
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
              {pending ? "Booking..." : "Confirm appointment"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}