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
        <div className="rounded-[32px] border border-neutral-200 bg-white/70 shadow-sm backdrop-blur">
          <div className="border-b border-neutral-200 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="ui-pill bg-neutral-900 text-white">
                    StyleSlot Admin
                  </span>
                  <span className="ui-pill bg-white text-neutral-600 ring-1 ring-neutral-200">
                    Dashboard workspace
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-neutral-500">
                  Protected admin area
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
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