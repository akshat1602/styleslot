"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type CreateAppointmentState = {
  ok: boolean;
  message: string;
  fieldErrors?: {
    serviceId?: string[];
    appointmentDate?: string[];
    selectedSlot?: string[];
    customerName?: string[];
    customerPhone?: string[];
  };
};

const createAppointmentSchema = z.object({
  serviceId: z.string().min(1, "Please select a service."),
  appointmentDate: z.string().min(1, "Please select a date."),
  selectedSlot: z.string().min(1, "Please select a time slot."),
  customerName: z.string().trim().min(2, "Please enter your name."),
  customerPhone: z.string().trim().min(8, "Please enter a valid phone number."),
});

function combineDateAndTime(dateString: string, timeString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function getDayRange(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  return { startOfDay, endOfDay };
}

function isPastDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);

  const selectedDate = new Date(year, month - 1, day, 0, 0, 0, 0);
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );

  return selectedDate < today;
}

export async function createAppointment(
  _prevState: CreateAppointmentState,
  formData: FormData
): Promise<CreateAppointmentState> {
  const raw = {
    serviceId: String(formData.get("serviceId") ?? ""),
    appointmentDate: String(formData.get("appointmentDate") ?? ""),
    selectedSlot: String(formData.get("selectedSlot") ?? ""),
    customerName: String(formData.get("customerName") ?? ""),
    customerPhone: String(formData.get("customerPhone") ?? ""),
  };

  const parsed = createAppointmentSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  if (isPastDate(parsed.data.appointmentDate)) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        appointmentDate: ["You cannot book an appointment for a past date."],
      },
    };
  }

  const service = await prisma.service.findUnique({
    where: { id: parsed.data.serviceId },
    select: {
      id: true,
      durationMin: true,
      isActive: true,
    },
  });

  if (!service || !service.isActive) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        serviceId: ["Selected service is not available."],
      },
    };
  }

  const startTime = combineDateAndTime(
    parsed.data.appointmentDate,
    parsed.data.selectedSlot
  );

  if (Number.isNaN(startTime.getTime())) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        selectedSlot: ["Invalid appointment time selected."],
      },
    };
  }

  const now = new Date();

  if (startTime <= now) {
    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        selectedSlot: ["You cannot book a past time slot."],
      },
    };
  }

  const endTime = new Date(startTime.getTime() + service.durationMin * 60 * 1000);

  const { startOfDay, endOfDay } = getDayRange(parsed.data.appointmentDate);

  const conflictingAppointment = await prisma.appointment.findFirst({
    where: {
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
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

  if (conflictingAppointment) {
    return {
      ok: false,
      message: "This slot has just been booked. Please choose another time.",
      fieldErrors: {
        selectedSlot: ["This slot has just been booked. Please choose another time."],
      },
    };
  }

  await prisma.appointment.create({
    data: {
      serviceId: parsed.data.serviceId,
      customerName: parsed.data.customerName,
      customerPhone: parsed.data.customerPhone,
      appointmentDate: startOfDay,
      startTime,
      endTime,
      status: "BOOKED",
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard?date=${parsed.data.appointmentDate}`);

  return {
    ok: true,
    message: "Appointment booked successfully.",
    fieldErrors: {},
  };
}