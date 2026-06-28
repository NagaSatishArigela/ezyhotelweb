"use client";

import { Search } from "lucide-react";
import { useHotelFilters } from "@/modules/hotels/hooks/useHotelFilters";

export default function ListSearchBar() {
  const { filters, setFilter } = useHotelFilters();

  return (
    <div className="relative w-full md:w-72">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <input
        type="text"
        placeholder="Search hotels..."
        value={filters.q ?? ""}
        onChange={(e) => setFilter("q", e.target.value || undefined)}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
      />
    </div>
  );
}
