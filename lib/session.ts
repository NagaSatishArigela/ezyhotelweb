import { jwtVerify } from "jose";

// Must match the backend JWT_ACCESS_SECRET env var
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "change-me-access-secret-at-least-32-chars"
);

export async function verifyAccessToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
