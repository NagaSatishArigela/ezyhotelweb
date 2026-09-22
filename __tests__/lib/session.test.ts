import { describe, it, expect, afterEach, vi } from "vitest";
import { verifyAccessToken } from "@/lib/session";

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("verifyAccessToken", () => {
  it("accepts demo tokens only in development", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await expect(verifyAccessToken("dev-access-token")).resolves.toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    await expect(verifyAccessToken("dev-access-token")).resolves.toBe(false);
  });
  it("uses backend verification for Railway-issued tokens", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response("{}", { status: 200 }))
      .mockResolvedValueOnce(new Response("{}", { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);
    await expect(verifyAccessToken("backend-token")).resolves.toBe(true);
    await expect(verifyAccessToken("forged-token")).resolves.toBe(false);
    expect(fetchMock).toHaveBeenNthCalledWith(1,
      "https://ezyhotelserver-production.up.railway.app/auth/me",
      expect.objectContaining({ headers: { Authorization: "Bearer backend-token" }}));
  });
});
