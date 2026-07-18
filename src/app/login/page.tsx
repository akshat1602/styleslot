"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAdmin, type LoginState } from "./actions";
import ThemeToggle from "@/components/theme-toggle";

const initialState: LoginState = {
  ok: false,
  message: "",
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

  return (
    <main className="ui-shell flex items-center justify-center px-4 py-10">
      <section className="ui-container">
        <div
          className="mx-auto max-w-5xl rounded-[32px] border shadow-[0_24px_80px_rgba(0,0,0,0.40)]"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface-soft)",
          }}
        >
          {/* shared inner padding, grid inside */}
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr] px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            {/* Left side */}
            <div className="pr-0 lg:pr-6">
              <div className="flex h-full flex-col justify-between gap-8">
                <div>
                  <div
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    StyleSlot Admin
                  </div>

                  <h1
                    className="mt-6 text-4xl font-bold tracking-tight"
                    style={{ color: "var(--text)" }}
                  >
                    Secure access to your salon dashboard
                  </h1>
                  <p
                    className="mt-4 max-w-md text-sm leading-7"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Manage appointments, services, and daily business activity
                    from one clean admin workspace.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div
                    className="rounded-3xl border p-5"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                    }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      What you can manage
                    </p>
                    <ul
                      className="mt-3 space-y-2 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <li>Daily appointments and status updates</li>
                      <li>Service pricing, duration, and availability</li>
                      <li>Weekly revenue and booking insights</li>
                    </ul>
                  </div>

                  <Link
                    href="/"
                    className="inline-flex w-fit items-center text-sm font-medium underline underline-offset-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Back to booking page
                  </Link>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="mt-8 lg:mt-0 lg:pl-6 relative">
              <div className="absolute right-0 top-0">
                <ThemeToggle />
              </div>

              <div className="mx-auto w-full max-w-md">
                <div className="mb-8">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="ui-pill"
                      style={{
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      Admin login
                    </span>
                    <span
                      className="ui-pill"
                      style={{
                        background: "var(--surface)",
                        color: "var(--text-muted)",
                        boxShadow: "inset 0 0 0 1px var(--border)",
                      }}
                    >
                      Protected area
                    </span>
                  </div>

                  <p
                    className="mt-4 text-sm font-medium"
                    style={{ color: "var(--text-muted)" }}
                  >
                    StyleSlot Admin
                  </p>
                  <h2
                    className="mt-2 text-3xl font-bold tracking-tight"
                    style={{ color: "var(--text)" }}
                  >
                    Welcome back
                  </h2>
                  <p
                    className="mt-3 text-sm leading-6"
                    style={{ color: "var(--text-muted)" }}
                  >
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
                    <p
                      className="mt-2 text-xs leading-5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      This area is restricted to administrators only.
                    </p>
                  </div>

                  {state.message ? (
                    <div
                      className="rounded-2xl border p-4 text-sm"
                      style={
                        state.ok
                          ? {
                              borderColor: "var(--border)",
                              background: "var(--success-soft)",
                              color: "var(--success)",
                            }
                          : {
                              borderColor: "var(--border)",
                              background: "var(--danger-soft)",
                              color: "var(--danger)",
                            }
                      }
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

                <div
                  className="mt-6 border-t pt-5 lg:hidden"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Link
                    href="/"
                    className="text-sm font-medium underline underline-offset-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Back to booking page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}