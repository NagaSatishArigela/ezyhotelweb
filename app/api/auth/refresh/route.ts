import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/session";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

// Silent token refresh. Reads the httpOnly pph_refresh cookie, exchanges it at
// the backend for a fresh token pair, re-sets both cookies, and returns the new
// access token to the client. The refresh token never touches JS.
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("pph_refresh")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  let tokens: { accessToken: string; refreshToken: string };
  try {
    const upstream = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!upstream.ok) {
      const res = NextResponse.json({ error: "Refresh rejected" }, { status: 401 });
      res.cookies.delete("pph_session");
      res.cookies.delete("pph_refresh");
      return res;
    }
    tokens = await upstream.json();
  } catch {
    return NextResponse.json({ error: "Refresh unavailable" }, { status: 502 });
  }

  if (!tokens?.accessToken || !(await verifyAccessToken(tokens.accessToken))) {
    return NextResponse.json({ error: "Invalid refreshed token" }, { status: 502 });
  }

  const res = NextResponse.json({ accessToken: tokens.accessToken });
  res.cookies.set("pph_session", tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 900,
  });
  if (tokens.refreshToken) {
    res.cookies.set("pph_refresh", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
  return res;
}
