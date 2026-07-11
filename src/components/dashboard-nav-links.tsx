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
            className={`ui-btn ${
              isActive
                ? "bg-neutral-900 text-white hover:bg-neutral-800"
                : "ui-btn-secondary"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}