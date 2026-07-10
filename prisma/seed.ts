import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.service.deleteMany();

  await prisma.salonSettings.upsert({
    where: { id: "default-salon-settings" },
    update: {
      salonName: "SalonSlot",
      address: "Lucknow",
      openTime: "10:00",
      closeTime: "20:00",
    },
    create: {
      id: "default-salon-settings",
      salonName: "SalonSlot",
      address: "Lucknow",
      openTime: "10:00",
      closeTime: "20:00",
    },
  });

  await prisma.service.createMany({
    data: [
      { name: "Haircut", durationMin: 30, price: 200, isActive: true },
      { name: "Shave", durationMin: 20, price: 120, isActive: true },
      { name: "Facial", durationMin: 45, price: 500, isActive: true },
      { name: "Haircut + Beard", durationMin: 45, price: 300, isActive: true },
      { name: "Hair Wash", durationMin: 15, price: 100, isActive: true }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });