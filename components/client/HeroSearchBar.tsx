"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";

const cities = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Gurgaon"];

export default function HeroSearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) { router.push("/hotels"); return; }
    const isCity = cities.find((c) => c.toLowerCase() === trimmed.toLowerCase());
    router.push(isCity ? `/hotels?city=${isCity}` : `/hotels?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-gray-200">
      <div className="flex-1 flex items-center gap-4 p-5 hover:bg-orange-50 transition group">
        <MapPin className="w-6 h-6 text-orange-600 shrink-0" />
        <div className="flex-1 text-left">
          <label className="block text-xs font-medium text-gray-500">Location</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="City, hotel, or neighborhood"
            className="w-full text-lg font-semibold text-gray-900 outline-none placeholder-gray-400 bg-transparent"
            aria-label="Search destination"
          />
        </div>
      </div>
      <button
        onClick={handleSearch}
        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg px-12 py-5 flex items-center justify-center gap-3 transition-all shadow-lg"
        aria-label="Search hotels"
      >
        <Search className="w-6 h-6" /> Search
      </button>
    </div>
  );
}
