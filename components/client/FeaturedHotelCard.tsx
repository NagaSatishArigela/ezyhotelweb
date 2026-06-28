"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, Heart, Wifi, Wind, Car, Waves, Dumbbell,
  Utensils, Shield, ChevronRight, Zap, Clock,
} from "lucide-react";
import type { HotelCardViewModel } from "@/types";
import { useFavourites } from "@/modules/hotels/hooks/useFavourites";
import { useToast } from "@/components/client/Toast";

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi,
  AC: Wind,
  Parking: Car,
  Pool: Waves,
  Gym: Dumbbell,
  Restaurant: Utensils,
  Spa: Heart,
  "Beach Access": Waves,
  "Couples Allowed": Heart,
  "Pet Friendly": Shield,
  "Business Center": Zap,
  "Valet Parking": Car,
  "Kids Club": Heart,
};

function starCategory(rating: number) {
  if (rating >= 4.5) return "5 Star";
  if (rating >= 4.0) return "4 Star";
  if (rating >= 3.5) return "3 Star";
  return "Budget";
}

export default function FeaturedHotelCard(vm: HotelCardViewModel) {
  const rating = parseFloat(vm.ratingLabel);
  const { toggle, isFavourite } = useFavourites();
  const { success } = useToast();
  const liked = isFavourite(vm.id);

  return (
    <Link
      href={`/hotels/${vm.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 w-full border border-orange-50 flex flex-col lg:flex-row h-auto lg:h-[18rem]"
    >
      {/* Image */}
      <div className="relative w-full lg:w-64 h-44 lg:h-full overflow-hidden flex-shrink-0">
        <Image
          src={vm.imageUrl}
          alt={vm.displayName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 256px"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
        <div className="absolute top-2 right-2 bg-orange-700 text-white px-2 py-0.5 rounded flex items-center gap-1 text-[9px] font-bold shadow-lg uppercase tracking-wider">
          <Star className="w-2.5 h-2.5 fill-white" /> {starCategory(rating)} Property
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div className="space-y-1.5">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <div className="bg-orange-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold shrink-0">
                  <Star className="w-2.5 h-2.5 fill-white" /> {vm.ratingLabel}
                  <span className="text-orange-100 font-normal">({vm.reviewsLabel})</span>
                </div>
                <div className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-bold border border-green-100 shrink-0">
                  <Zap className="w-2.5 h-2.5 fill-green-700" /> BUDGET
                </div>
                <div className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-bold border border-blue-100 shrink-0">
                  <Clock className="w-2.5 h-2.5" /> {vm.bookingPolicy === "hourly" ? "HOURLY" : "24H MIN"}
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors truncate">
                {vm.displayName}
              </h3>
              <p className="text-gray-500 flex items-center gap-1 text-[11px] font-medium">
                <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                {vm.location}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggle(vm.id);
                success(liked ? `Removed from favourites` : `${vm.displayName} saved!`);
              }}
              className={`transition-colors ml-2 shrink-0 ${liked ? "text-orange-500" : "text-gray-300 hover:text-orange-500"}`}
              aria-label={liked ? "Remove from favourites" : "Save hotel"}
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-orange-500" : ""}`} />
            </button>
          </div>

          {/* Amenity pills — from actual data */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {vm.amenityBadges.map((amenity) => {
              const Icon = AMENITY_ICONS[amenity] ?? Shield;
              return (
                <span key={amenity} className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border border-orange-100 uppercase tracking-tighter">
                  <Icon className="w-2.5 h-2.5" /> {amenity}
                </span>
              );
            })}
            {vm.isCoupleFriendly && !vm.amenityBadges.includes("Couples Allowed") && (
              <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 border border-orange-100 uppercase tracking-tighter">
                <Heart className="w-2.5 h-2.5 fill-orange-700" /> Couple Friendly
              </span>
            )}
          </div>

          <p className="text-[11px] lg:text-xs text-gray-500 font-medium leading-relaxed line-clamp-2 mt-2 opacity-80">
            {vm.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="flex flex-col sm:flex-row gap-y-3 gap-x-6 items-start sm:items-end mt-4 pt-3 border-t border-orange-50">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide w-full sm:w-auto">
            {vm.priceSlots.map((slot, i) => (
              <div key={slot.label} className="bg-white border border-orange-100 rounded-lg px-2.5 py-1 min-w-[72px] text-center hover:bg-orange-50 transition-colors cursor-pointer flex-shrink-0">
                <div className="text-sm font-bold text-orange-700">{slot.price}</div>
                {i === 0 && (
                  <div className="text-[8px] text-gray-400 line-through">{vm.originalPriceLabel}</div>
                )}
                <div className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">{slot.label}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 w-full sm:w-auto justify-start shrink-0">
            <span className="flex-1 sm:flex-none px-4 py-1.5 bg-orange-600 text-white font-bold text-[10px] rounded-lg hover:bg-orange-700 flex items-center justify-center gap-1 whitespace-nowrap shadow-sm uppercase tracking-widest">
              Book Now <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
