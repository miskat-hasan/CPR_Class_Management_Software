// src/middleware.js
import { NextResponse } from "next/server";
import { roleDefaultPage, roleSegment } from "./config";

function getRoleHome(role) {
  const segment     = roleSegment[role];
  const defaultPage = roleDefaultPage[role];

  if (!segment) return "/login";
  return `/dashboard/${segment}/${defaultPage}`;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token        = request.cookies.get("token")?.value;
  const role         = request.cookies.get("role")?.value;

  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const segment = roleSegment[role];
  if (!segment) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    return NextResponse.redirect(
      new URL(getRoleHome(role), request.url)
    );
  }

  const hasRoleAccess = pathname.startsWith(`/dashboard/${segment}`);

  if (!hasRoleAccess) {
    return NextResponse.redirect(
      new URL(getRoleHome(role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};