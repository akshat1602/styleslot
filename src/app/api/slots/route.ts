import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  minutesToTimeString,
  rangesOverlap,
  timeStringToMinutes,
} from "@/lib/slots";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");

  if (!serviceId || !date) {
    return NextResponse.json(
      { error: "serviceId and date are required" },
      { status: 400 }
    );
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
  });

  const settings = await prisma.salonSettings.findFirst();

  if (!service || !settings) {
    return NextResponse.json(
      { error: "Service or salon settings not found" },
      { status: 404 }
    );
  }

  const openMinutes = timeStringToMinutes(settings.openTime);
  const closeMinutes = timeStringToMinutes(settings.closeTime);
  const duration = service.durationMin;
  const slotStep = 15;

  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59.999`);

  const appointments = await prisma.appointment.findMany({
    where: {
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        not: "CANCELLED",
      },
    },
    select: {
      startTime: true,
      endTime: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  const bookedRanges = appointments.map((appointment) => {
    const start = appointment.startTime;
    const end = appointment.endTime;

    return {
      startMinutes: start.getHours() * 60 + start.getMinutes(),
      endMinutes: end.getHours() * 60 + end.getMinutes(),
    };
  });

  const availableSlots: string[] = [];

  for (
    let slotStart = openMinutes;
    slotStart + duration <= closeMinutes;
    slotStart += slotStep
  ) {
    const slotEnd = slotStart + duration;

    const hasConflict = bookedRanges.some((booking) =>
      rangesOverlap(
        slotStart,
        slotEnd,
        booking.startMinutes,
        booking.endMinutes
      )
    );

    if (!hasConflict) {
      availableSlots.push(minutesToTimeString(slotStart));
    }
  }

  return NextResponse.json({
    date,
    serviceId,
    serviceDuration: service.durationMin,
    openTime: settings.openTime,
    closeTime: settings.closeTime,
    availableSlots,
  });
}