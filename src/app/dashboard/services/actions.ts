"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type ServiceActionState = {
  ok: boolean;
  message: string;
};

const serviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name must be at least 2 characters.")
    .max(100, "Service name must be 100 characters or less."),
  durationMin: z.coerce
    .number()
    .int("Duration must be a whole number.")
    .min(5, "Duration must be at least 5 minutes.")
    .max(480, "Duration must be 480 minutes or less."),
  price: z.coerce
    .number()
    .int("Price must be a whole number.")
    .min(0, "Price cannot be negative.")
    .max(100000, "Price is too high."),
});

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export async function createService(
  _prevState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    durationMin: formData.get("durationMin"),
    price: formData.get("price"),
  };

  const parsed = serviceSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Invalid service details.",
    };
  }

  const name = normalizeName(parsed.data.name);

  const existingService = await prisma.service.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingService) {
    return {
      ok: false,
      message: "A service with this name already exists.",
    };
  }

  await prisma.service.create({
    data: {
      name,
      durationMin: parsed.data.durationMin,
      price: parsed.data.price,
      isActive: true,
    },
  });

  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");

  redirect("/dashboard/services");
}

export async function updateService(
  _prevState: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const serviceId = String(formData.get("serviceId") ?? "").trim();

  if (!serviceId) {
    return {
      ok: false,
      message: "Service not found.",
    };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    durationMin: formData.get("durationMin"),
    price: formData.get("price"),
  };

  const parsed = serviceSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Invalid service details.",
    };
  }

  const existingService = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!existingService) {
    return {
      ok: false,
      message: "Service not found.",
    };
  }

  const name = normalizeName(parsed.data.name);

  const duplicateService = await prisma.service.findFirst({
    where: {
      id: {
        not: serviceId,
      },
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (duplicateService) {
    return {
      ok: false,
      message: "Another service with this name already exists.",
    };
  }

  await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      name,
      durationMin: parsed.data.durationMin,
      price: parsed.data.price,
    },
  });

  revalidatePath("/dashboard/services");
  revalidatePath(`/dashboard/services/${serviceId}/edit`);
  revalidatePath("/dashboard");

  redirect("/dashboard/services");
}

export async function toggleServiceActive(formData: FormData) {
  const serviceId = String(formData.get("serviceId") ?? "").trim();

  if (!serviceId) {
    return;
  }

  const existingService = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!existingService) {
    return;
  }

  await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      isActive: !existingService.isActive,
    },
  });

  revalidatePath("/dashboard/services");
  revalidatePath("/dashboard");
}