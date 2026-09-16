import { jwtVerify } from "jose";

export async function verifyAccessToken(token: string): Promise<boolean> {
  if (token === "dev-access-token") return process.env.NODE_ENV === "development";
  try {
    const secret = process.env.JWT_SECRET;
    if (secret) {
      await jwtVerify(token, new TextEncoder().encode(secret), {
        algorithms: ["HS256"], requiredClaims: ["exp"],
      });
      return true;
    }
    // Without the signing key, delegate verification to the backend.
    // Never trust an expiry decoded from an unverified JWT.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://ezyhotelserver-production.up.railway.app";
    const response = await fetch(apiUrl + "/auth/me", {
      headers: { Authorization: "Bearer " + token },
      cache: "no-store", signal: AbortSignal.timeout(10_000),
    });
    return response.ok;
  } catch { return false; }
}
