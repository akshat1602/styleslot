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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-40 w-40 rounded-full bg-neutral-200/60 blur-3xl" />
        <div className="absolute right-10 top-24 h-48 w-48 rounded-full bg-slate-200/60 blur-3xl" />
      </div>

      <section className="relative w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-[32px] border border-neutral-200 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.10)] backdrop-blur xl:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden border-r border-neutral-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-10 xl:flex xl:flex-col xl:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full bg-neutral-900 px-3 py-1 text-xs font-medium text-white">
                StyleSlot Admin
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-neutral-900">
                Secure access to your salon dashboard
              </h1>
              <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600">
                Manage appointments, services, and daily business activity from
                one clean admin workspace.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-3xl border border-neutral-200 bg-white/80 p-5">
                <p className="text-sm font-semibold text-neutral-900">
                  What you can manage
                </p>
                <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                  <li>Daily appointments and status updates</li>
                  <li>Service pricing, duration, and availability</li>
                  <li>Weekly revenue and booking insights</li>
                </ul>
              </div>

              <Link
                href="/"
                className="inline-flex w-fit items-center text-sm font-medium text-neutral-700 underline underline-offset-4"
              >
                Back to booking page
              </Link>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ui-pill bg-neutral-900 text-white">
                    Admin login
                  </span>
                  <span className="ui-pill bg-white text-neutral-600 ring-1 ring-neutral-200">
                    Protected area
                  </span>
                </div>

                <p className="mt-4 text-sm font-medium text-neutral-500">
                  StyleSlot Admin
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900">
                  Welcome back
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Enter the admin password to access the dashboard.
                </p>
              </div>

              <form action={formAction} className="space-y-5">
                <div>
                  <label htmlFor="password" className="ui-label">
                    Admin password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className="ui-input"
                  />
                  <p className="mt-2 text-xs leading-5 text-neutral-500">
                    This area is restricted to administrators only.
                  </p>
                </div>

                {state.message ? (
                  <div
                    className={`rounded-2xl border p-4 text-sm ${
                      state.ok
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {state.message}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={pending}
                  className="ui-btn ui-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? "Checking..." : "Login"}
                </button>
              </form>

              <div className="mt-6 border-t border-neutral-200 pt-5 xl:hidden">
                <Link
                  href="/"
                  className="text-sm font-medium text-neutral-700 underline underline-offset-4"
                >
                  Back to booking page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}