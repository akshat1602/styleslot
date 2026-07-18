"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/dashboard",
    label: "Overview",
  },
  {
    href: "/dashboard/services",
    label: "Services",
  },
  {
    href: "/",
    label: "Booking page",
  },
];

export default function DashboardNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : item.href === "/dashboard/services"
            ? pathname.startsWith("/dashboard/services")
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="ui-btn"
            style={
              isActive
                ? {
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                    boxShadow: "var(--shadow-sm)",
                  }
                : {
                    background: "var(--surface-soft)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border-strong)",
                  }
            }
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}