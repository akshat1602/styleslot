import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/booking-form";

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    prisma.salonSettings.findFirst(),
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        durationMin: true,
        price: true,
      },
    }),
  ]);

  return (
    <BookingForm
      salonName={settings?.salonName ?? "SalonSlot"}
      address={settings?.address ?? null}
      openTime={settings?.openTime ?? "10:00"}
      closeTime={settings?.closeTime ?? "20:00"}
      services={services}
    />
  );
}