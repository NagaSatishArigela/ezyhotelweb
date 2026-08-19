import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/session";

// Sets / clears the httpOnly pph_session cookie from the server side.
// Called by client components after receiving tokens from the backend.

// Reports whether the pph_session cookie is present and still valid.
// Client-side auth state is persisted in localStorage independently of this
// httpOnly cookie, so pages must check this before trusting "logged in" state.
export async function GET(req: NextRequest) {
  const token = req.cookies.get("pph_session")?.value;
  const valid = !!token && (await verifyAccessToken(token));
  return NextResponse.json({ valid });
}

export async function POST(req: NextRequest) {
  const { accessToken, refreshToken } = await req.json();

  if (!accessToken || typeof accessToken !== "string") {
    return NextResponse.json({ error: "accessToken required" }, { status: 400 });
  }

  const valid = await verifyAccessToken(accessToken);
  if (!valid) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("pph_session", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 900, // 15 min — matches backend access token expiry
  });
  // Persist the refresh token httpOnly so a page reload can silently recover a
  // live session (see /api/auth/refresh). Never exposed to JS → XSS-safe.
  if (typeof refreshToken === "string" && refreshToken) {
    res.cookies.set("pph_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days — matches backend refresh token expiry
    });
  }
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("pph_session");
  res.cookies.delete("pph_refresh");
  return res;
}
