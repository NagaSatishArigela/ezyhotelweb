import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("pph_session")?.value;

  // All other protected routes — any authenticated guest user
  if (!token) return NextResponse.redirect(new URL("/login", req.url));
  const valid = await verifyAccessToken(token);
  if (!valid) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("pph_session");
    return res;
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/booking/:path*",
    "/booking-confirm/:path*",
    "/payment",
    "/my-bookings",
    "/profile",
    "/profile/:path*",
    "/checkout/:path*",
  ],
};
