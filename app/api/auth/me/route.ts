import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/session";

// Restores auth after a page reload. The pph_session cookie IS the backend
// access token; if it still verifies we hand it back so Redux can be rehydrated
// with a live token (merged onto the user already restored from localStorage).
// We do NOT reconstruct the user from the token — the backend token payload
// ({id, globalRole, sessionId}) is not the web User shape.
export async function GET(req: NextRequest) {
  const token = req.cookies.get("pph_session")?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  const valid = await verifyAccessToken(token);
  if (!valid) return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({ authenticated: true, accessToken: token });
}
