"use client";

import { XCircle } from "lucide-react";
import { useHotelFilters } from "@/modules/hotels/hooks/useHotelFilters";

const AMENITIES = ["WiFi", "AC", "Parking", "Couples Allowed"];
const RATINGS = [4, 3, 2];

interface FilterSidebarProps {
  onClose?: () => void;
}

export default function FilterSidebar({ onClose }: FilterSidebarProps) {
  const { filters, setFilter, clearFilters } = useHotelFilters();

  const toggleAmenity = (amenity: string) => {
    const current = filters.amenities ? filters.amenities.split(",").filter(Boolean) : [];
    const next = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    setFilter("amenities", next.length > 0 ? next.join(",") : undefined);
  };

  const setRating = (r: number) => {
    const current = Number(filters.rating ?? 0);
    setFilter("rating", current === r ? undefined : String(r));
  };

  const maxPrice = Number(filters.maxPrice ?? 200);
  const activeAmenities = filters.amenities ? filters.amenities.split(",").filter(Boolean) : [];
  const activeRating = Number(filters.rating ?? 0);

  return (
    <aside className="w-full h-full flex-shrink-0 bg-white dark:bg-slate-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Filters</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
          >
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 text-slate-700 dark:text-white" aria-label="Close filters">
              <XCircle className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Price per hour</h3>
          <input
            type="range"
            min="0"
            max="300"
            value={maxPrice}
            onChange={(e) => setFilter("maxPrice", e.target.value, 300)}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-sm mt-2 text-slate-500">
            <span>₹{filters.minPrice ?? 0}</span>
            <span>₹{maxPrice}</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Amenities</h3>
          {AMENITIES.map((amenity) => (
            <label key={amenity} className="flex items-center space-x-3 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={activeAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="h-5 w-5 rounded border-slate-300 bg-transparent text-primary focus:ring-primary/50"
              />
              <span className="text-slate-600 dark:text-slate-300">{amenity}</span>
            </label>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Rating</h3>
          <div className="flex gap-2 flex-wrap">
            {RATINGS.map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  activeRating === r
                    ? "border-primary text-primary bg-primary/10"
                    : "border-slate-300 text-slate-500"
                }`}
              >
                {r}+ stars
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
