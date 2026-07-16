import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  minutesToTimeString,
  rangesOverlap,
  timeStringToMinutes,
} from "@/lib/slots";

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function getLocalDateOnly(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCurrentLocalMinutes(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function combineDateAndMinutes(dateString: string, totalMinutes: number) {
  const [year, month, day] = dateString.split("-").map(Number);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

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

  const requestedDate = parseLocalDate(date);

  if (Number.isNaN(requestedDate.getTime())) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const today = getLocalDateOnly(new Date());

  if (requestedDate.getTime() < today.getTime()) {
    return NextResponse.json({
      date,
      serviceId,
      serviceDuration: 0,
      openTime: "",
      closeTime: "",
      availableSlots: [],
    });
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

  const now = new Date();
  const isToday = requestedDate.getTime() === today.getTime();
  const currentMinutes = getCurrentLocalMinutes(now);

  if (isToday && currentMinutes >= closeMinutes) {
    return NextResponse.json({
      date,
      serviceId,
      serviceDuration: service.durationMin,
      openTime: settings.openTime,
      closeTime: settings.closeTime,
      availableSlots: [],
    });
  }

  const startOfDay = parseLocalDate(date);
  const endOfDay = new Date(
    startOfDay.getFullYear(),
    startOfDay.getMonth(),
    startOfDay.getDate(),
    23,
    59,
    59,
    999
  );

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

    if (slotEnd > closeMinutes) {
      continue;
    }

    if (isToday) {
      if (slotStart <= currentMinutes) {
        continue;
      }
    }

    const hasConflict = bookedRanges.some((booking) =>
      rangesOverlap(
        slotStart,
        slotEnd,
        booking.startMinutes,
        booking.endMinutes
      )
    );

    if (hasConflict) {
      continue;
    }

    availableSlots.push(minutesToTimeString(slotStart));
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