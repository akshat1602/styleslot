"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateStatusSchema = z.object({
  appointmentId: z.string().min(1),
  status: z.enum(["COMPLETED", "CANCELLED"]),
  date: z.string().min(1),
});

export async function updateAppointmentStatus(formData: FormData) {
  const raw = {
    appointmentId: String(formData.get("appointmentId") ?? ""),
    status: String(formData.get("status") ?? ""),
    date: String(formData.get("date") ?? ""),
  };

  const parsed = updateStatusSchema.safeParse(raw);

  if (!parsed.success) {
    return;
  }

  await prisma.appointment.updateMany({
    where: {
      id: parsed.data.appointmentId,
      status: "BOOKED",
    },
    data: {
      status: parsed.data.status,
    },
  });

  revalidatePath(`/dashboard?date=${parsed.data.date}`);
  revalidatePath("/dashboard");
}