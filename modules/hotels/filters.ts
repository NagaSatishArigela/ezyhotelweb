import type { FilterParams } from "@/types";

export function normalizeFilters(raw: Record<string, string | string[] | undefined>): FilterParams {
  const result: FilterParams = {};
  for (const key of ["q", "city", "amenities", "minPrice", "maxPrice", "rating"] as const) {
    const entry = raw[key];
    const value = (Array.isArray(entry) ? entry[0] : entry)?.trim();
    if (!value) continue;
    if (["minPrice", "maxPrice", "rating"].includes(key) && (!Number.isFinite(Number(value)) || Number(value) < 0)) continue;
    result[key] = value;
  }
  const sort = Array.isArray(raw.sort) ? raw.sort[0] : raw.sort;
  if (sort === "price_asc" || sort === "price_desc" || sort === "rating_desc" || sort === "relevance") result.sort = sort;
  return result;
}
