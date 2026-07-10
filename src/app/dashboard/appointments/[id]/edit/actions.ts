"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type ActionState = {
  ok: boolean;
  message: string;
};

function combineDateAndTime(dateString: string, timeString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const [hours, minutes] = timeString.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export async function updateAppointment(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const appointmentId = String(formData.get("appointmentId") || "").trim();
  const serviceId = String(formData.get("serviceId") || "").trim();
  const appointmentDate = String(formData.get("appointmentDate") || "").trim();
  const selectedSlot = String(formData.get("selectedSlot") || "").trim();
  const backDate = String(formData.get("backDate") || "").trim();

  if (!appointmentId || !serviceId || !appointmentDate || !selectedSlot) {
    return {
      ok: false,
      message: "Please select service, date, and slot.",
    };
  }

  const existingAppointment = await prisma.appointment.findUnique({
    where: {
      id: appointmentId,
    },
    include: {
      service: true,
    },
  });

  if (!existingAppointment) {
    return {
      ok: false,
      message: "Appointment not found.",
    };
  }

  if (existingAppointment.status !== "BOOKED") {
    return {
      ok: false,
      message: "Only booked appointments can be rescheduled.",
    };
  }

  const selectedService = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!selectedService || !selectedService.isActive) {
    return {
      ok: false,
      message: "Selected service is not available.",
    };
  }

  const newStartTime = combineDateAndTime(appointmentDate, selectedSlot);
  const newEndTime = new Date(
    newStartTime.getTime() + selectedService.durationMin * 60 * 1000
  );

  const now = new Date();

  if (newStartTime < now) {
    return {
      ok: false,
      message: "Cannot reschedule to a past time.",
    };
  }

  const conflictingAppointment = await prisma.appointment.findFirst({
    where: {
      id: {
        not: appointmentId,
      },
      status: "BOOKED",
      startTime: {
        lt: newEndTime,
      },
      endTime: {
        gt: newStartTime,
      },
    },
  });

  if (conflictingAppointment) {
    return {
      ok: false,
      message: "This slot is no longer available.",
    };
  }

  await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      serviceId: selectedService.id,
      appointmentDate: newStartTime,
      startTime: newStartTime,
      endTime: newEndTime,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/appointments/${appointmentId}/edit`);

  redirect(`/dashboard?date=${backDate || appointmentDate}`);
}