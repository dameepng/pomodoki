import { NextResponse } from "next/server";

import { COOKIE_NAME } from "@/core/constants/index.js";
import jwtService from "@/infrastructure/services/jwt.service.js";

const publicRoutes = ["/login", "/register"];
const authRoutes = ["/login", "/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? await jwtService.verifyToken(token) : null;
  const isAuthenticated = Boolean(payload);

  if (authRoutes.includes(pathname) && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!publicRoutes.includes(pathname) && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
