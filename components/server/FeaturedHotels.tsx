import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const featuredHotels = [
  { id: 1, name: "The Grand Hotel", price: 25, rating: 4.8, reviews: "1,234", imageUrl: "https://picsum.photos/seed/hotel1/400/300" },
  { id: 2, name: "City Center Inn", price: 20, rating: 4.5, reviews: "876", imageUrl: "https://picsum.photos/seed/hotel2/400/300" },
  { id: 3, name: "Lakeside Resort", price: 30, rating: 4.9, reviews: "2,019", imageUrl: "https://picsum.photos/seed/hotel3/400/300" },
  { id: 4, name: "Mountain View Lodge", price: 35, rating: 4.7, reviews: "950", imageUrl: "https://picsum.photos/seed/hotel4/400/300" },
];

export function FeaturedHotels() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-10">Featured Hotels</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredHotels.map((hotel) => (
            <div key={hotel.id} className="group flex flex-col overflow-hidden rounded-xl w-full max-w-sm mx-auto bg-white shadow-lg">
              <div className="relative overflow-hidden rounded-t-xl">
                <Image
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  width={400}
                  height={224}
                  className="w-full h-56 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-xl font-semibold text-secondary mb-1">{hotel.name}</h3>
                  <p className="text-secondary font-normal text-lg">{`$${hotel.price}/hour`}</p>
                </div>
                <div className="flex items-center text-sm mb-6">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-slate-700">{` ${hotel.rating} (${hotel.reviews} reviews)`}</span>
                </div>
                <Button className="w-full h-10 bg-primary/30 text-secondary rounded-lg text-base font-medium transition-colors">
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
