import { SignJWT, jwtVerify, type JWTPayload as JosePayload } from "jose";
import type { User } from "@/types";
import type { UserRole } from "@/store/authSlice";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

// Evaluated once at module load — avoids per-call TextEncoder allocation
const JWT_SECRET = new TextEncoder().encode(requireEnv("JWT_SECRET"));

export interface JWTPayload {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
}

function isJWTPayload(p: JosePayload): p is JosePayload & JWTPayload {
  return (
    typeof p["userId"] === "number" &&
    typeof p["email"] === "string" &&
    typeof p["name"] === "string" &&
    (p["role"] === "guest" || p["role"] === "owner")
  );
}

export async function signJWT(payload: JWTPayload, expiry = "24h"): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiry)
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!isJWTPayload(payload)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function userFromJWTPayload(payload: JWTPayload): User {
  return {
    id: payload.userId,
    name: payload.name,
    username: payload.email.split("@")[0],
    email: payload.email,
  };
}
