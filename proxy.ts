import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/session";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("pph_session")?.value;

  // /owner/* routes are removed — all owner operations happen in the partner
  // portal. Redirect there instead of to /register: an authenticated owner sent
  // to /register?intent=owner is re-redirected back to /owner/* → infinite loop.
  if (pathname.startsWith("/owner/")) {
    return NextResponse.redirect(new URL("/login", PORTAL_URL));
  }

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
    "/owner/:path*",
    "/booking/:path*",
    "/booking-confirm/:path*",
    "/payment",
    "/my-bookings",
    "/profile",
    "/profile/:path*",
    "/checkout/:path*",
  ],
};
