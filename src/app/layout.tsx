import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StyleSlot",
  description: "Salon appointment booking and dashboard",
};

const themeScript = `
  (function () {
    try {
      var storedTheme = localStorage.getItem("theme");
      var systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var theme =
        storedTheme === "dark" || storedTheme === "light"
          ? storedTheme
          : systemPrefersDark
            ? "dark"
            : "light";

      document.documentElement.setAttribute("data-theme", theme);
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--text)]">
        {children}
      </body>
    </html>
  );
}