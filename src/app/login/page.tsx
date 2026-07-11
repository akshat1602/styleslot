"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAdmin, type LoginState } from "./actions";

const initialState: LoginState = {
  ok: false,
  message: "",
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-neutral-500">StyleSlot Admin</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">
            Admin login
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Enter the admin password to access the dashboard.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-neutral-700"
            >
              Admin password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter password"
              className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
            />
          </div>

          {state.message ? (
            <p
              className={`text-sm ${
                state.ok ? "text-green-600" : "text-red-600"
              }`}
            >
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {pending ? "Checking..." : "Login"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-neutral-700 underline underline-offset-4"
          >
            Back to booking page
          </Link>
        </div>
      </div>
    </main>
  );
}