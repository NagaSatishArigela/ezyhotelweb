import { NextRequest, NextResponse } from "next/server";

// Server-validated promo codes — never expose these to the client bundle.
// In production, fetch from a database/CMS with per-user usage tracking.
const PROMO_REGISTRY: Record<string, { discount: number; maxUses: number | null }> = {
  PPH10:     { discount: 10, maxUses: null },
  WELCOME20: { discount: 20, maxUses: 1   },
  FIRST25:   { discount: 25, maxUses: 1   },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
): Promise<NextResponse> {
  const { code } = await params;
  const entry = PROMO_REGISTRY[code.trim().toUpperCase()];

  if (!entry) {
    return NextResponse.json({ valid: false, message: "Invalid or expired promo code." }, { status: 200 });
  }

  return NextResponse.json({ valid: true, discount: entry.discount });
}
