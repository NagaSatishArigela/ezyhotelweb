import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import HeroSearchBar from "@/components/client/HeroSearchBar";

const destinations = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai"];

export function HeroSection() {
  return (
    <section className="relative h-[65vh] md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero image — LCP element: priority + fill */}
      <Image
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
        alt="Luxury hotel pool at sunset"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
          Over <span className="text-orange-400">174,000+</span> hotels and homes across{" "}
          <span className="text-orange-400">35+</span> countries
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-12 drop-shadow-md">
          Discover your perfect stay with amazing deals and real guest reviews
        </p>

        {/* Search tray — interactive parts in Client Component */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl mx-auto">
          <HeroSearchBar />
        </div>

        {/* Popular Destinations */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {destinations.map((dest) => (
            <Link
              key={dest}
              href={`/hotels?city=${dest}`}
              className="flex items-center gap-2 px-6 py-3 bg-orange-100/80 backdrop-blur-md rounded-full text-orange-800 font-medium hover:bg-orange-200 transition"
            >
              {dest} <ChevronRight className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
