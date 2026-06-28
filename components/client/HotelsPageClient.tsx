"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { SlidersHorizontal, SearchX, Home, ChevronRight, MapPin, ArrowUpDown, X } from "lucide-react";
import type { HotelCardViewModel, FilterParams } from "@/types";
import FeaturedHotelCard from "@/components/client/FeaturedHotelCard";
import ListSearchBar from "@/components/client/ListSearchBar";

const FilterSidebar = dynamic(() => import("@/components/client/FilterSidebar"), { ssr: false });

const SORT_OPTIONS: { value: FilterParams["sort"]; label: string }[] = [
  { value: "relevance",   label: "Relevance" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Top Rated" },
];

interface HotelsPageClientProps {
  viewModels: HotelCardViewModel[];
  totalCount: number;
  activeFilters: FilterParams;
}

export default function HotelsPageClient({ viewModels, totalCount, activeFilters }: HotelsPageClientProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCity   = activeFilters.city;
  const activeQuery  = activeFilters.q;
  const activeSort   = activeFilters.sort ?? "relevance";

  const pageTitle = activeCity
    ? `Hotels in ${activeCity}`
    : activeQuery
    ? `Results for "${activeQuery}"`
    : "Find your stay";

  // Count active non-sort filters for the badge
  const filterCount = [activeFilters.q, activeFilters.city, activeFilters.minPrice, activeFilters.maxPrice, activeFilters.amenities, activeFilters.rating].filter(Boolean).length;

  const setSort = (sort: FilterParams["sort"]) => {
    const params = new URLSearchParams(searchParams.toString());
    sort && sort !== "relevance" ? params.set("sort", sort) : params.delete("sort");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => router.push(pathname);

  // Active filter chips (excludes sort)
  const chips: { label: string; key: string }[] = [
    ...(activeFilters.q ? [{ label: `"${activeFilters.q}"`, key: "q" }] : []),
    ...(activeFilters.city ? [{ label: activeFilters.city, key: "city" }] : []),
    ...(activeFilters.rating ? [{ label: `${activeFilters.rating}+ stars`, key: "rating" }] : []),
    ...(activeFilters.amenities ? activeFilters.amenities.split(",").filter(Boolean).map((a) => ({ label: a, key: `amenity-${a}` })) : []),
    ...(activeFilters.minPrice || activeFilters.maxPrice ? [{ label: `₹${activeFilters.minPrice ?? 0}–₹${activeFilters.maxPrice ?? "∞"}/hr`, key: "price" }] : []),
  ];

  const removeChip = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key.startsWith("amenity-")) {
      const name = key.replace("amenity-", "");
      const current = (params.get("amenities") ?? "").split(",").filter((a) => a && a !== name);
      current.length ? params.set("amenities", current.join(",")) : params.delete("amenities");
    } else if (key === "price") {
      params.delete("minPrice"); params.delete("maxPrice");
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      <div className="flex h-full grow relative">
        {/* Sidebar */}
        <div className={`lg:static fixed inset-y-0 left-0 z-50 w-80 lg:w-64 bg-white transform ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto border-r border-gray-100`}>
          <FilterSidebar onClose={() => setMobileFilterOpen(false)} />
        </div>

        {mobileFilterOpen && (
          <div className="fixed inset-0 z-40 lg:hidden bg-gray-500/50" onClick={() => setMobileFilterOpen(false)} />
        )}

        <main className="flex-1 p-4 lg:p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 mb-4">
              <Link href="/" className="hover:text-gray-600 flex items-center gap-1"><Home className="w-3 h-3" /> Home</Link>
              <ChevronRight className="w-3 h-3 opacity-50" />
              <Link href="/hotels" className="hover:text-gray-600">Hotels</Link>
              {activeCity && (
                <>
                  <ChevronRight className="w-3 h-3 opacity-50" />
                  <span className="text-gray-700 font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-500" />{activeCity}</span>
                </>
              )}
            </nav>

            <div className="flex flex-col mb-4 gap-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{pageTitle}</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {totalCount} {totalCount === 1 ? "property" : "properties"} found
                    {activeCity ? ` in ${activeCity}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      value={activeSort}
                      onChange={(e) => setSort(e.target.value as FilterParams["sort"])}
                      className="appearance-none pl-8 pr-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl bg-white text-gray-700 focus:outline-none focus:border-orange-400 cursor-pointer"
                    >
                      {SORT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                  {/* Mobile filter button */}
                  <button
                    className="lg:hidden relative p-2.5 rounded-xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100"
                    onClick={() => setMobileFilterOpen(true)}
                    aria-label="Open filters"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                    {filterCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {filterCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <ListSearchBar />

              {/* Active filter chips */}
              {chips.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  {chips.map((chip) => (
                    <button
                      key={chip.key}
                      onClick={() => removeChip(chip.key)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 border border-orange-200 rounded-full text-xs font-semibold hover:bg-orange-100 transition-colors"
                    >
                      {chip.label}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  <button
                    onClick={clearAll}
                    className="text-xs font-semibold text-gray-400 hover:text-orange-600 transition-colors underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {viewModels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                  <SearchX className="w-10 h-10 text-orange-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No hotels found</h2>
                <p className="text-gray-500 text-sm mb-6 max-w-sm">
                  Try adjusting your filters or search for a different city or keyword.
                </p>
                <button onClick={clearAll} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {viewModels.map((vm) => (
                  <FeaturedHotelCard key={vm.id} {...vm} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
