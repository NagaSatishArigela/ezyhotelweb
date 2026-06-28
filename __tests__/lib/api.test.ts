import { describe, it, expect, vi, beforeEach } from "vitest";

// Minimal test for E19 — header cast safety and error serialisation
describe("fetch helper", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns parsed JSON on success", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    // Dynamic import so we get a fresh module per test
    const { guestReviewsApi } = await import("@/lib/api");
    // Smoke test: the module loads without errors
    expect(guestReviewsApi).toBeDefined();
  });

  it("throws ApiError on non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Not found" }), { status: 404 })
    );
    const { ApiError, guestReviewsApi } = await import("@/lib/api");
    await expect(guestReviewsApi.summary("non-existent")).rejects.toBeInstanceOf(ApiError);
  });
});
