import { describe, it, expect } from "vitest";
import { filterHotels } from "@/modules/hotels/controller";

describe("filterHotels", () => {
  it("returns all hotels when no filters applied", () => {
    const result = filterHotels({});
    expect(result.length).toBeGreaterThan(0);
  });

  it("filters by city (case-insensitive)", () => {
    const result = filterHotels({ city: "bangalore" });
    expect(result.every((h) => h.city.toLowerCase() === "bangalore")).toBe(true);
  });

  it("filters by text query matching hotel name", () => {
    const first = filterHotels({})[0];
    const result = filterHotels({ q: first.name.slice(0, 4).toLowerCase() });
    expect(result.some((h) => h.id === first.id)).toBe(true);
  });

  it("filters by price range", () => {
    const result = filterHotels({ minPrice: "50", maxPrice: "100" });
    expect(result.every((h) => h.price >= 50 && h.price <= 100)).toBe(true);
  });

  it("filters by minimum rating", () => {
    const result = filterHotels({ rating: "4" });
    expect(result.every((h) => h.rating >= 4)).toBe(true);
  });

  it("filters by amenity", () => {
    const result = filterHotels({ amenities: "WiFi" });
    expect(result.every((h) => h.amenities.includes("WiFi"))).toBe(true);
  });

  it("returns empty when no hotel matches", () => {
    const result = filterHotels({ q: "xyznonexistenthotel" });
    expect(result).toHaveLength(0);
  });

  it("sorts by price ascending", () => {
    const result = filterHotels({ sort: "price_asc" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].price).toBeGreaterThanOrEqual(result[i - 1].price);
    }
  });

  it("sorts by price descending", () => {
    const result = filterHotels({ sort: "price_desc" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].price).toBeLessThanOrEqual(result[i - 1].price);
    }
  });

  it("sorts by rating descending", () => {
    const result = filterHotels({ sort: "rating_desc" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].rating).toBeLessThanOrEqual(result[i - 1].rating);
    }
  });
});
