import { hotelsData } from "@/data/hotelsData";
import { toHotelCardViewModel, toRealPropertyCardViewModel } from "./view-model";
import { publicPropertiesApi } from "@/lib/api";
import type { FilterParams, HotelsPageViewModel } from "@/types";

export function filterHotels(params: FilterParams) {
  const q = params.q?.toLowerCase() ?? "";
  const city = params.city?.toLowerCase() ?? "";
  const minPrice = Number(params.minPrice ?? 0);
  const maxPrice = Number(params.maxPrice ?? 999999);
  const rating = Number(params.rating ?? 0);
  const amenities = params.amenities ? params.amenities.split(",").filter(Boolean) : [];

  const filtered = hotelsData.filter((hotel) => {
    const matchesSearch = hotel.name.toLowerCase().includes(q) || hotel.area.toLowerCase().includes(q);
    const matchesCity = !city || hotel.city.toLowerCase() === city;
    const matchesPrice = hotel.price >= minPrice && hotel.price <= maxPrice;
    const matchesRating = hotel.rating >= rating;
    const matchesAmenities = amenities.every((a) => hotel.amenities.includes(a));
    return matchesSearch && matchesCity && matchesPrice && matchesRating && matchesAmenities;
  });

  switch (params.sort) {
    case "price_asc":  return [...filtered].sort((a, b) => a.price - b.price);
    case "price_desc": return [...filtered].sort((a, b) => b.price - a.price);
    case "rating_desc": return [...filtered].sort((a, b) => b.rating - a.rating);
    default: return filtered;
  }
}

/** Fetches real (Postgres-backed) properties matching the filters from quicknestserver (M4). */
async function fetchRealProperties(params: FilterParams) {
  // rating has no data source yet (no Reviews module) - intentionally not sent, per M4 spec §1.
  try {
    const result = await publicPropertiesApi.list({
      limit: 50,
      q: params.q,
      city: params.city,
      minPrice: params.minPrice ? Number(params.minPrice) * 100 : undefined,
      maxPrice: params.maxPrice ? Number(params.maxPrice) * 100 : undefined,
      amenities: params.amenities,
    });
    return result.items;
  } catch {
    return [];
  }
}

export async function buildHotelsPageViewModel(params: FilterParams): Promise<HotelsPageViewModel> {
  const filtered = filterHotels(params);
  const realProperties = await fetchRealProperties(params);

  return {
    viewModels: [...realProperties.map(toRealPropertyCardViewModel), ...filtered.map(toHotelCardViewModel)],
    activeFilters: params,
    totalCount: filtered.length + realProperties.length,
  };
}

export function getHotelById(id: number) {
  return hotelsData.find((h) => h.id === id) ?? null;
}
