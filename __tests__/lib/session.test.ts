import { describe, it, expect, afterEach, vi } from "vitest";
import { SignJWT } from "jose";
import { verifyAccessToken } from "@/lib/session";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("verifyAccessToken", () => {
  it("accepts demo tokens only in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await expect(verifyAccessToken("dev-access-token")).resolves.toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    await expect(verifyAccessToken("dev-access-token")).resolves.toBe(false);
  });
  it("checks signature and expiry", async () => {
    vi.stubEnv("JWT_SECRET", "correct-secret");
    const sign = (secret: string, expiry: string) => new SignJWT({ id: "guest" })
      .setProtectedHeader({ alg: "HS256" }).setExpirationTime(expiry)
      .sign(new TextEncoder().encode(secret));
    await expect(verifyAccessToken(await sign("correct-secret", "1h"))).resolves.toBe(true);
    await expect(verifyAccessToken(await sign("wrong-secret", "1h"))).resolves.toBe(false);
    await expect(verifyAccessToken(await sign("correct-secret", "-1h"))).resolves.toBe(false);
  });
  it("uses backend verification without a signing key", async () => {
    vi.stubEnv("JWT_SECRET", "");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("{}", { status: 200 }))
      .mockResolvedValueOnce(new Response("{}", { status: 401 })));
    await expect(verifyAccessToken("backend-token")).resolves.toBe(true);
    await expect(verifyAccessToken("forged-token")).resolves.toBe(false);
  });
});
