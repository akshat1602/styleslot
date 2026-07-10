"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  appointmentDate: z.string().min(1, "Please select a date"),
  selectedSlot: z.string().min(1, "Please select a time slot"),
  customerName: z.string().min(2, "Name is too short"),
  customerPhone: z.string().min(10, "Phone number is too short"),
});

function parseTimeToDate(dateString: string, timeString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export async function createAppointment(_: unknown, formData: FormData) {
  const raw = {
    serviceId: String(formData.get("serviceId") ?? ""),
    appointmentDate: String(formData.get("appointmentDate") ?? ""),
    selectedSlot: String(formData.get("selectedSlot") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    customerPhone: String(formData.get("customerPhone") ?? ""),
  };

  const parsed = bookingSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fill all fields correctly.",
    };
  }

  const service = await prisma.service.findUnique({
    where: { id: parsed.data.serviceId },
    select: {
      id: true,
      durationMin: true,
    },
  });

  if (!service) {
    return {
      ok: false,
      message: "Selected service not found.",
    };
  }

  const startTime = parseTimeToDate(
    parsed.data.appointmentDate,
    parsed.data.selectedSlot
  );

  const endTime = new Date(
    startTime.getTime() + service.durationMin * 60 * 1000
  );

  const [year, month, day] = parsed.data.appointmentDate.split("-").map(Number);
  const appointmentDate = new Date(year, month - 1, day);

  const conflict = await prisma.appointment.findFirst({
    where: {
      appointmentDate,
      status: {
        not: "CANCELLED",
      },
      startTime: {
        lt: endTime,
      },
      endTime: {
        gt: startTime,
      },
    },
    select: {
      id: true,
    },
  });

  if (conflict) {
    return {
      ok: false,
      message: "This slot was just booked. Please choose another slot.",
    };
  }

  await prisma.appointment.create({
    data: {
      serviceId: service.id,
      customerName: parsed.data.customerName.trim(),
      customerPhone: parsed.data.customerPhone.trim(),
      appointmentDate,
      startTime,
      endTime,
      status: "BOOKED",
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "Appointment booked successfully.",
  };
}