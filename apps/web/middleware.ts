import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
  const verificationStep = request.cookies.get("verificationStep")?.value;
  const { pathname } = request.nextUrl;

  // Routes yang memerlukan token (authenticated) untuk role admin
  const adminRoute = ["/dashboard"].some((route) => pathname.startsWith(route));

  // Routes yang memerlukan token (authenticated) untuk semua role
  const protectedRoute = ["/profile"].some((route) =>
    pathname.startsWith(route),
  );

  // Routes verification flow (setelah register)
  const isVerificationFlow = ["/send-otp", "/one-time-password"].some((route) =>
    pathname.startsWith(route),
  );

  // Routes auth (login/register)
  const unprotectedRoute = ["/login", "/register", "/login/admin"].some(
    (route) => pathname.startsWith(route),
  );

  // 1. Jika akses protected route tanpa token, redirect ke login
  if (protectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (adminRoute) {
    if (role !== "Admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (role === "Admin" && !token) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
  }

  // 2. Jika sudah login (punya token) tidak bisa masuk ke page login/register
  if (unprotectedRoute && token) {
    if (role === "Admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Verification flow - hanya bisa diakses jika ada verificationStep
  if (isVerificationFlow) {
    // Jika tidak ada verificationStep, redirect ke home
    if (!verificationStep) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Di halaman send-otp, harus ada step "email-send"
    if (pathname.startsWith("/send-otp")) {
      if (verificationStep !== "email-sent") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // Di halaman one-time-password, harus ada step "otp-send"
    if (pathname.startsWith("/one-time-password")) {
      if (verificationStep !== "otp-sent") {
        return NextResponse.redirect(new URL("/send-otp", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/send-otp:path*",
    "/one-time-password:path*",
    "/dashboard:path*",
    "/profile:path*",
    "/login:path*",
    "/register:path*",
  ],
};
