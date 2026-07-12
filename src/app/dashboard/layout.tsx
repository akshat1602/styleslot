import { logoutAdmin } from "@/app/login/actions";
import DashboardNavLinks from "@/components/dashboard-nav-links";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="ui-shell">
      <div className="ui-container py-4 sm:py-6">
        <div
          className="rounded-[32px] border shadow-sm backdrop-blur"
          style={{
            borderColor: "var(--border)",
            background: "rgba(255, 249, 245, 0.78)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            className="px-4 py-4 sm:px-6"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="ui-pill"
                    style={{
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    StyleSlot Admin
                  </span>
                  <span
                    className="ui-pill"
                    style={{
                      background: "var(--surface)",
                      color: "var(--text-muted)",
                      boxShadow: "inset 0 0 0 1px var(--border)",
                    }}
                  >
                    Dashboard workspace
                  </span>
                </div>

                <p
                  className="mt-3 text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Protected admin area
                </p>
                <h1
                  className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl"
                  style={{ color: "var(--text)" }}
                >
                  Manage salon operations
                </h1>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <DashboardNavLinks />

                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="ui-btn ui-btn-secondary w-full sm:w-auto"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="px-2 py-2 sm:px-3 sm:py-3">{children}</div>
        </div>
      </div>
    </div>
  );
}