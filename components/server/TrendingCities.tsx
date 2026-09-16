import Image from "next/image";
import Link from "next/link";

const cities = [
  { name: "Mumbai", price: "Starts at ₹499 / 3h", image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=800" },
  { name: "Delhi", price: "Starts at ₹399 / 3h", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800" },
  { name: "Bengaluru", price: "Starts at ₹349 / 3h", image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=800" },
  { name: "Hyderabad", price: "Starts at ₹299 / 3h", image: "https://images.unsplash.com/photo-1551161242-b5af797b7233?auto=format&fit=crop&q=80&w=800" },
];

export function TrendingCities() {
  return (
    <section id="trending-cities" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 below-fold">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-brand-black">Trending Cities</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cities.map((city, index) => (
          <Link key={index} href={`/hotels?city=${encodeURIComponent(city.name === "Bengaluru" ? "Bangalore" : city.name)}`} className="relative group cursor-pointer overflow-hidden rounded-2xl h-[400px] block">
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
