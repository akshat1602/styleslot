import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  minutesToTimeString,
  rangesOverlap,
  timeStringToMinutes,
} from "@/lib/slots";
import { formatInTimeZone } from "date-fns-tz";

const SALON_TIME_ZONE = "Asia/Kolkata";

function parseDateParts(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  return { year, month, day };
}

function getZonedDateString(date: Date, timeZone: string) {
  return formatInTimeZone(date, timeZone, "yyyy-MM-dd");
}

function getZonedCurrentMinutes(date: Date, timeZone: string) {
  const hours = Number(formatInTimeZone(date, timeZone, "HH"));
  const minutes = Number(formatInTimeZone(date, timeZone, "mm"));
  return hours * 60 + minutes;
}

function getZonedTimeParts(date: Date, timeZone: string) {
  return {
    year: Number(formatInTimeZone(date, timeZone, "yyyy")),
    month: Number(formatInTimeZone(date, timeZone, "MM")),
    day: Number(formatInTimeZone(date, timeZone, "dd")),
  };
}

function compareDateOnly(a: string, b: string) {
  const aNum = Number(a.replaceAll("-", ""));
  const bNum = Number(b.replaceAll("-", ""));
  return aNum - bNum;
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

  const dateParts = parseDateParts(date);

  if (
    Number.isNaN(dateParts.year) ||
    Number.isNaN(dateParts.month) ||
    Number.isNaN(dateParts.day)
  ) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const now = new Date();
  const todayInSalonTz = getZonedDateString(now, SALON_TIME_ZONE);
  const isToday = date === todayInSalonTz;

  if (compareDateOnly(date, todayInSalonTz) < 0) {
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
  const currentMinutes = getZonedCurrentMinutes(now, SALON_TIME_ZONE);

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

  const startOfDay = new Date(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
    0,
    0,
    0,
    0
  );

  const endOfDay = new Date(
    dateParts.year,
    dateParts.month - 1,
    dateParts.day,
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
    const startHours = Number(
      formatInTimeZone(appointment.startTime, SALON_TIME_ZONE, "HH")
    );
    const startMinutes = Number(
      formatInTimeZone(appointment.startTime, SALON_TIME_ZONE, "mm")
    );
    const endHours = Number(
      formatInTimeZone(appointment.endTime, SALON_TIME_ZONE, "HH")
    );
    const endMinutes = Number(
      formatInTimeZone(appointment.endTime, SALON_TIME_ZONE, "mm")
    );

    return {
      startMinutes: startHours * 60 + startMinutes,
      endMinutes: endHours * 60 + endMinutes,
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

    if (isToday && slotStart <= currentMinutes) {
      continue;
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