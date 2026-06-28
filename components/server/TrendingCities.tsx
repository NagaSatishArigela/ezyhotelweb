import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cities = [
  { name: "New York", price: "Starts at $55 / 3h", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800" },
  { name: "London", price: "Starts at £45 / 3h", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=800" },
  { name: "Dubai", price: "Starts at AED 150 / 3h", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800" },
  { name: "Paris", price: "Starts at €50 / 3h", image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800" },
];

export function TrendingCities() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 below-fold">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-brand-black">Trending Cities</h2>
        <div className="flex gap-3">
          <button className="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all text-brand-gray" aria-label="Previous">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all text-brand-gray" aria-label="Next">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cities.map((city, index) => (
          <Link key={index} href="/hotels" className="relative group cursor-pointer overflow-hidden rounded-2xl h-[400px] block">
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-extrabold mb-1">{city.name}</h3>
              <p className="text-sm font-medium opacity-90">{city.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
