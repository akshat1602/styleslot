"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LoginState = {
  ok: boolean;
  message: string;
};

export async function loginAdmin(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") || "");
  const adminPassword = process.env.ADMIN_LOGIN_PASSWORD;
  const adminToken = process.env.ADMIN_AUTH_TOKEN;

  if (!adminPassword || !adminToken) {
    return {
      ok: false,
      message: "Admin login is not configured.",
    };
  }

  if (!password) {
    return {
      ok: false,
      message: "Password is required.",
    };
  }

  if (password !== adminPassword) {
    return {
      ok: false,
      message: "Invalid admin password.",
    };
  }

  const cookieStore = await cookies();

  cookieStore.set("admin-session", adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();

  cookieStore.delete("admin-session");

  redirect("/login");
}