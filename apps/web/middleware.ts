import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname, search } = request.nextUrl;
  const currentURL = pathname + search;

  const protectedRoute = [
    "/verification-code",
    "/one-time-password",
    "/forgot-password",
    "/reset-password",
    "/dashboard",
    "/profile"
  ].some((route) => pathname.startsWith(route));
  const unprotectedRoute = ["/login", "/register"].some((route) =>
    pathname.startsWith(route),
  );

  if (protectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", currentURL);
    return NextResponse.redirect(loginUrl);
  }

  if (unprotectedRoute && token) {
    const redirectTo = request.nextUrl.searchParams.get("redirect");

    if (redirectTo) {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    if (redirectTo) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/verification-code:path*",
    "/one-time-password:path*",
    "/forgot-password:path*",
    "/reset-password:path*",
    "/dashboard:path*",
    "/profile:path*",
  ],
};
