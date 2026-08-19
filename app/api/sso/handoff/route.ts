import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// The partner portal is a different origin, so the redeem (GET) endpoint must be
// CORS-callable from it. PILOT HARDENING: move this store to the backend (Redis)
// and redeem server-to-server so it survives restarts and multi-instance — this
// in-memory Map is single-instance/dev only.
const PORTAL_ORIGIN = process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3000";

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": PORTAL_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

// In-memory one-time-code store. Each code is valid for 60 seconds.
interface HandoffEntry {
  accessToken: string;
  refreshToken: string;
  phone?: string;
  email?: string;
  expiresAt: number;
}
const HANDOFF_CODES = new Map<string, HandoffEntry>();

setInterval(() => {
  const now = Date.now();
  for (const [code, entry] of HANDOFF_CODES) {
    if (entry.expiresAt < now) HANDOFF_CODES.delete(code);
  }
}, 30_000);

// POST: called by the web app after registration to exchange tokens for a code.
// The code is passed in the redirect URL to the partner portal (?code=<uuid>).
// Tokens never appear in a URL — they stay server-side until the portal redeems them.
export async function POST(req: NextRequest) {
  const { accessToken, refreshToken, phone, email } = await req.json();

  if (!accessToken || typeof accessToken !== "string" || !refreshToken || typeof refreshToken !== "string") {
    return NextResponse.json({ error: "accessToken and refreshToken required" }, { status: 400 });
  }

  const code = randomUUID();
  HANDOFF_CODES.set(code, {
    accessToken,
    refreshToken,
    phone: typeof phone === "string" ? phone : undefined,
    email: typeof email === "string" ? email : undefined,
    expiresAt: Date.now() + 60_000,
  });

  return NextResponse.json({ code });
}

// GET ?code=<uuid>: called server-to-server by the partner portal to redeem the code.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  const entry = HANDOFF_CODES.get(code);
  if (!entry || entry.expiresAt < Date.now()) {
    HANDOFF_CODES.delete(code ?? "");
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401, headers: corsHeaders() });
  }

  HANDOFF_CODES.delete(code);
  return NextResponse.json(
    { accessToken: entry.accessToken, refreshToken: entry.refreshToken, phone: entry.phone, email: entry.email },
    { headers: corsHeaders() },
  );
}
