import { describe, it, expect, afterEach } from "vitest";
import { verifyAccessToken } from "@/lib/session";

describe("verifyAccessToken", () => {
  const originalSecret = process.env.JWT_SECRET;
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
  });

  it("accepts dev tokens when JWT_SECRET is missing in local development", async () => {
    delete process.env.JWT_SECRET;
    process.env.NODE_ENV = "development";

    await expect(verifyAccessToken("dev-access-token")).resolves.toBe(true);
  });
});
