import { logoutAdmin } from "@/app/login/actions";
import DashboardNavLinks from "@/components/dashboard-nav-links";
import ThemeToggle from "@/components/theme-toggle";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="ui-shell">
      <div className="ui-container py-4 sm:py-6">
        <div
          className="rounded-[32px] border shadow-sm"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface-soft)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div
            className="px-4 py-4 sm:px-6"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* left title block unchanged */}

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <DashboardNavLinks />

                <ThemeToggle />

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