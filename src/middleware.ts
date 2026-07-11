import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get("admin-session")?.value;
  const expectedToken = process.env.ADMIN_AUTH_TOKEN;

  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/login";

  const isLoggedIn =
    Boolean(adminSession) &&
    Boolean(expectedToken) &&
    adminSession === expectedToken;

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoginRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};