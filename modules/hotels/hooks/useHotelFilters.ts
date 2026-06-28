"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useRef } from "react";
import type { FilterParams } from "@/types";

export function useHotelFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filters: FilterParams = {
    q: searchParams.get("q") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
    amenities: searchParams.get("amenities") ?? undefined,
    rating: searchParams.get("rating") ?? undefined,
  };

  const setFilter = useCallback(
    (key: keyof FilterParams, value: string | undefined, debounceMs = 0) => {
      const apply = () => {
        const params = new URLSearchParams(searchParams.toString());
        value ? params.set(key, value) : params.delete(key);
        router.push(`${pathname}?${params.toString()}`);
      };

      if (debounceMs > 0) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(apply, debounceMs);
      } else {
        apply();
      }
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return { filters, setFilter, clearFilters };
}
