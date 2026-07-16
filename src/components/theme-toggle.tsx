"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme =
      root.getAttribute("data-theme") === "dark" ? "dark" : "light";

    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = theme === "dark" ? "light" : "dark";

    root.setAttribute("data-theme", nextTheme);
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-11 w-11 items-center justify-center rounded-full border transition"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        borderColor: "var(--border)",
        background: "var(--surface)",
        color: "var(--text)",
        boxShadow: "var(--shadow-sm)",
        opacity: mounted ? 1 : 0.92,
      }}
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2.75v2.1" />
          <path d="M12 19.15v2.1" />
          <path d="M4.75 4.75l1.45 1.45" />
          <path d="M17.8 17.8l1.45 1.45" />
          <path d="M2.75 12h2.1" />
          <path d="M19.15 12h2.1" />
          <path d="M4.75 19.25l1.45-1.45" />
          <path d="M17.8 6.2l1.45-1.45" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3c.31 0 .46.38.24.6A7 7 0 0 0 20.4 12.55c.22-.22.6-.07.6.24Z" />
        </svg>
      )}
    </button>
  );
}