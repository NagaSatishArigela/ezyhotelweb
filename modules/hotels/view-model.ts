import type { Hotel, HotelCardViewModel } from "@/types";
import type { PublicPropertySummary } from "@/lib/api";

export function toHotelCardViewModel(hotel: Hotel): HotelCardViewModel {
  const basePrice = hotel.price;
  return {
    id: hotel.id,
    displayName: hotel.name,
    city: hotel.city,
    location: `${hotel.area}, ${hotel.city}`,
    priceLabel: `₹${basePrice}/hr`,
    originalPriceLabel: `₹${Math.round(basePrice * 1.4)}`,
    ratingLabel: hotel.rating.toFixed(1),
    reviewsLabel: `${hotel.reviews} reviews`,
    amenityBadges: hotel.amenities.slice(0, 3),
    hasMoreAmenities: hotel.amenities.length > 3,
    imageUrl: hotel.image,
    isCoupleFriendly: hotel.amenities.includes("Couples Allowed"),
    bookingPolicy: "hourly",
    priceSlots: [
      { label: "3 Hrs", price: `₹${basePrice}` },
      { label: "6 Hrs", price: `₹${Math.round(basePrice * 1.7)}` },
      { label: "12 Hrs", price: `₹${Math.round(basePrice * 2.8)}` },
    ],
    description:
      "A wonderful property offering best-in-class comfort, exceptional service, and elegant rooms suited for all types of travelers.",
  };
}

const PLACEHOLDER_IMAGE = "https://placehold.co/800x600?text=PayPerHour";

/** Maps a real (Postgres-backed) property from /properties/public to the shared card view model. */
export function toRealPropertyCardViewModel(property: PublicPropertySummary): HotelCardViewModel {
  const hourlyRupees =
    property.startingHourlyRatePaise != null ? Math.round(property.startingHourlyRatePaise / 100) : null;
  const fulldayRupees =
    property.startingFulldayRatePaise != null ? Math.round(property.startingFulldayRatePaise / 100) : null;
  const basePrice = hourlyRupees ?? fulldayRupees ?? 0;

  return {
    id: property.id,
    displayName: property.name,
    city: property.city ?? "",
    location: [property.area, property.city].filter(Boolean).join(", "),
    priceLabel: hourlyRupees != null ? `₹${hourlyRupees}/hr` : "Contact for price",
    originalPriceLabel: `₹${Math.round(basePrice * 1.4)}`,
    ratingLabel: "New",
    reviewsLabel: "New listing",
    amenityBadges: property.amenities.slice(0, 3),
    hasMoreAmenities: property.amenities.length > 3,
    imageUrl: property.primaryImageUrl ?? PLACEHOLDER_IMAGE,
    isCoupleFriendly: property.amenities.some((a) => a.toLowerCase().includes("couple")),
    bookingPolicy: property.bookingPolicy === "fullday" ? "24h" : "hourly",
    priceSlots: [
      { label: "3 Hrs", price: hourlyRupees != null ? `₹${hourlyRupees * 3}` : "—" },
      { label: "6 Hrs", price: hourlyRupees != null ? `₹${Math.round(hourlyRupees * 6 * 0.9)}` : "—" },
      {
        label: "24 Hrs",
        price: fulldayRupees != null ? `₹${fulldayRupees}` : hourlyRupees != null ? `₹${hourlyRupees * 24}` : "—",
      },
    ],
    description: property.description ?? "A PayPerHour partner property offering comfortable, flexible stays.",
  };
}
