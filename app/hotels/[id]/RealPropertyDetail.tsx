import Link from "next/link";
import { ChevronRight, MapPin, Wifi, Wind, Car, Waves, Dumbbell, Utensils, Shield, Zap, Clock } from "lucide-react";
import type { PublicPropertyDetail } from "@/lib/api";
import { HotelGalleryLazy as HotelGallery, RealHotelBookingPanelLazy as RealHotelBookingPanel } from "@/components/client/HotelDetailLoaders";
import HotelLocationMap from "@/components/client/HotelLocationMap";
import PropertyReviews from "@/components/client/PropertyReviews";

const AMENITY_ICONS: Record<string, React.ElementType> = {
  WiFi: Wifi,
  AC: Wind,
  Parking: Car,
  Pool: Waves,
  Gym: Dumbbell,
  Restaurant: Utensils,
  Spa: Shield,
  TV: Zap,
};

const policies = [
  "Guests must present a physical ID proof (Aadhar/Passport). Soft copies not accepted.",
  "Both guests must present valid ID for couple stays.",
  "Standard check-in applies; early arrival subject to availability.",
];

export default function RealPropertyDetail({ property }: { property: PublicPropertyDetail }) {
  const images = property.photos.length > 0
    ? property.photos.map((p) => p.url)
    : property.primaryImageUrl
      ? [property.primaryImageUrl]
      : [];

  const bookingPolicyLabel =
    property.bookingPolicy === "hourly" ? "Hourly" : property.bookingPolicy === "fullday" ? "Full Day" : "Hourly & Full Day";

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans text-gray-900">
      <div className="h-1 bg-orange-600 w-full" />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href="/hotels" className="hover:text-gray-600">Hotels</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-gray-900 font-bold">{property.name}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4 lg:space-y-6 pb-20 lg:pb-0">
          {images.length > 0 && <HotelGallery images={images} hotelName={property.name} />}

          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{property.name}</h1>
              <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                {property.category && (
                  <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded text-[10px] font-bold border border-[#C8E6C9] flex items-center gap-1 uppercase">
                    <Zap className="w-3 h-3 fill-[#2E7D32]" /> {property.category}
                  </span>
                )}
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 flex items-center gap-1 uppercase">
                  <Clock className="w-3 h-3" /> {bookingPolicyLabel}
                </span>
                <span className="hidden lg:inline text-gray-400">|</span>
                <p className="w-full lg:w-auto text-sm text-gray-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" /> {[property.area, property.city].filter(Boolean).join(", ") || "India"}
                </p>
              </div>
            </div>
            {property.description && (
              <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
            )}
          </div>

          {property.amenities.length > 0 && (
            <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = AMENITY_ICONS[amenity] ?? Shield;
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                      <Icon className="w-5 h-5 text-orange-600 shrink-0" />
                      <span className="text-sm font-bold text-gray-700">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {property.latitude != null && property.longitude != null && (
            <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Location</h2>
              <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden relative shadow-inner border border-gray-200 z-0">
                <HotelLocationMap hotelName={property.name} />
              </div>
            </div>
          )}

          <PropertyReviews propertyId={property.id} />

          <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hotel Policy</p>
              <h2 className="text-xl font-bold text-gray-900">What you must know</h2>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <h4 className="text-xs font-bold text-gray-700 uppercase">Check-in Requirements</h4>
              <ul className="space-y-3">
                {policies.map((rule, idx) => (
                  <li key={idx} className="flex gap-3 text-xs text-gray-500 leading-relaxed">
                    <div className="w-1 h-1 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4" id="booking">
          <RealHotelBookingPanel
            propertyId={property.id}
            roomTypes={property.roomTypes}
            bookingPolicy={property.bookingPolicy}
            minBookingHours={property.minBookingHours}
          />
        </div>
      </main>
    </div>
  );
}
