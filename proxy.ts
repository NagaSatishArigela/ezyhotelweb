import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/session";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("pph_session")?.value;

  // /owner/* routes are removed — all owner operations happen in the partner
  // portal. If someone navigates to /owner/* directly, send them to register.
  if (pathname.startsWith("/owner/")) {
    return NextResponse.redirect(new URL("/register?intent=owner", req.url));
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
