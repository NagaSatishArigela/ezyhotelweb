export async function verifyAccessToken(token: string): Promise<boolean> {
  if (token === "dev-access-token") return process.env.NODE_ENV === "development";
  try {
    // The backend owns the JWT signing secret and session revocation state.
    // Validate Railway-issued tokens through its authenticated endpoint.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://ezyhotelserver-production.up.railway.app";
    const response = await fetch(apiUrl + "/auth/me", {
      headers: { Authorization: "Bearer " + token },
      cache: "no-store", signal: AbortSignal.timeout(10_000),
    });
    return response.ok;
  } catch { return false; }
}
