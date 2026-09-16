import { describe, expect, it } from "vitest";
import { safeInternalRedirect } from "@/lib/navigation";
import { normalizeFilters } from "@/modules/hotels/filters";

describe("login return path", () => {
  it("preserves the booking query", () => {
    expect(safeInternalRedirect("/booking/123?guests=2")).toBe("/booking/123?guests=2");
  });
  it.each([null, "https://other.test", "//other.test", "/\\other.test", "/\n/other.test", "/login", "/register"])("rejects unsafe or looping path %s", (path) => {
    expect(safeInternalRedirect(path)).toBeNull();
  });
});

it("handles repeated search params and invalid numeric filters", () => {
  expect(normalizeFilters({ city: ["Mumbai", "Delhi"], minPrice: "NaN", maxPrice: "-5", amenities: ["WiFi", "AC"] }))
    .toEqual({ city: "Mumbai", amenities: "WiFi" });
});
