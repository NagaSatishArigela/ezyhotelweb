import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Star, MapPin, Heart, Share2, Wifi, Wind, Car, Waves,
  Dumbbell, Utensils, Shield, Zap, Clock, ChevronRight,
} from "lucide-react";
import { hotelsData } from "@/data/hotelsData";
import { HotelGalleryLazy as HotelGallery, HotelBookingPanelLazy as HotelBookingPanel } from "@/components/client/HotelDetailLoaders";
import HotelLocationMap from "@/components/client/HotelLocationMap";
import { publicPropertiesApi, ApiError } from "@/lib/api";
import RealPropertyDetail from "./RealPropertyDetail";

const BASE = "https://ezyhotels.com";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  // Demo hotels (with fabricated ratings/reviews) must never be pre-built into
  // the production bundle — only real backend properties ship to prod.
  if (process.env.NODE_ENV === "production") return [];
  return hotelsData.map((h) => ({ id: String(h.id) }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  if (UUID_RE.test(id)) {
    try {
      const property = await publicPropertiesApi.getById(id);
      return {
        title: `${property.name} — Book by the Hour`,
        description: property.description ?? `Book ${property.name} on EzyHotels.com.`,
      };
    } catch {
      return { title: "Property Not Found" };
    }
  }

  const hotel = hotelsData.find((h) => h.id === Number(id));
  if (!hotel) return { title: "Hotel Not Found" };
  return {
    title: `${hotel.name} — Book by the Hour`,
    description: `Book ${hotel.name} by the hour. Rated ${hotel.rating}/5 by ${hotel.reviews} guests. Amenities: ${hotel.amenities.join(", ")}.`,
  };
}

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

const reviewStats = [
  { label: "Excellent", percentage: 42 },
  { label: "Very Good", percentage: 47 },
  { label: "Average", percentage: 11 },
];

const mockReviews = [
  { name: "Rahul Sharma", date: "2 Days ago", rating: 5, text: "Excellent stay! Clean rooms and very cooperative staff." },
  { name: "Priya Singh", date: "1 Week ago", rating: 4, text: "Good experience overall. Location is a bit inside but peaceful." },
];

const policies = [
  "Guests must present a physical ID proof (Aadhar/Passport). Soft copies not accepted.",
  "Both guests must present valid ID for couple stays.",
  "Children up to 5 years stay free of charge.",
  "Standard check-in applies; early arrival subject to availability.",
];

export default async function HotelDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (UUID_RE.test(id)) {
    let property;
    try {
      property = await publicPropertiesApi.getById(id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) notFound();
      throw err;
    }
    return <RealPropertyDetail property={property} />;
  }

  // Demo (numeric-id) hotels are dev-only; never render them in production.
  if (process.env.NODE_ENV === "production") notFound();

  const hotel = hotelsData.find((h) => h.id === Number(id));
  if (!hotel) notFound();

  const basePrice = hotel.price;

  const images = [
    hotel.image,
    `https://picsum.photos/seed/${hotel.id + 50}/800/600`,
    `https://picsum.photos/seed/${hotel.id + 51}/800/600`,
    `https://picsum.photos/seed/${hotel.id + 52}/800/600`,
    `https://picsum.photos/seed/${hotel.id + 53}/800/600`,
  ];

  const plans = [
    { hours: 3, price: basePrice },
    { hours: 6, price: Math.round(basePrice * 1.7) },
    { hours: 12, price: Math.round(basePrice * 2.8) },
    { hours: 24, price: Math.round(basePrice * 4.5) },
  ];

  // Similar: same price band (±40%), exclude current, take first 2
  const similar = hotelsData
    .filter((h) => h.id !== hotel.id && Math.abs(h.price - hotel.price) / hotel.price <= 0.4)
    .slice(0, 2);
  if (similar.length < 2) {
    hotelsData
      .filter((h) => h.id !== hotel.id && !similar.find((s) => s.id === h.id))
      .slice(0, 2 - similar.length)
      .forEach((h) => similar.push(h));
  }

  const isCoupleFriendly = hotel.amenities.includes("Couples Allowed");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: hotel.name,
    description: `Book ${hotel.name} by the hour in ${hotel.area}, ${hotel.city}. Rated ${hotel.rating}/5.`,
    url: `${BASE}/hotels/${hotel.id}`,
    image: hotel.image,
    address: { "@type": "PostalAddress", addressLocality: hotel.area, addressRegion: hotel.city, addressCountry: "IN" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: hotel.rating, reviewCount: hotel.reviews },
    priceRange: `₹${hotel.price}–₹${Math.round(hotel.price * 4.5)} per booking`,
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-20 font-sans text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="h-1 bg-orange-600 w-full" />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
          <Link href="/" className="hover:text-gray-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <Link href="/hotels" className="hover:text-gray-600">Hotels</Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-gray-900 font-bold">{hotel.name}</span>
        </nav>
      </div>

      <main className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-4 lg:space-y-6 pb-20 lg:pb-0">

          <HotelGallery images={images} hotelName={hotel.name} />

          {/* Header info */}
          <div className="bg-white p-4 lg:p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">{hotel.name}</h1>
                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                  <span className="bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded text-[10px] font-bold border border-[#C8E6C9] flex items-center gap-1 uppercase">
                    <Zap className="w-3 h-3 fill-[#2E7D32]" /> Budget
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 flex items-center gap-1 uppercase">
                    <Clock className="w-3 h-3" /> Hourly
                  </span>
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Star className="w-4 h-4 fill-gray-800" /> {hotel.rating.toFixed(1)}
                    <span className="text-gray-400 font-normal ml-0.5">({hotel.reviews} reviews)</span>
                  </div>
                  <span className="hidden lg:inline text-gray-400">|</span>
                  <p className="w-full lg:w-auto text-sm text-gray-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" /> India
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="p-2 lg:p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                  <Heart className="w-5 h-5 text-gray-300" />
                </button>
                <button className="p-2 lg:p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                  <Share2 className="w-5 h-5 text-gray-300" />
                </button>
              </div>
            </div>
            {isCoupleFriendly && (
              <span className="bg-[#FFF5F5] text-[#E53E3E] px-3 py-1.5 rounded-lg text-[10px] font-bold border border-[#FED7D7] inline-flex items-center gap-2 uppercase tracking-tight">
                <Heart className="w-3.5 h-3.5 fill-[#E53E3E]" /> Couple Friendly
              </span>
            )}
          </div>

          {/* Rating stats */}
          <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-6 mb-8">
              <div className="text-5xl font-bold text-gray-900">{hotel.rating.toFixed(1)}</div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Based on {hotel.reviews} ratings</p>
                <div className="flex text-yellow-400">
                  {Array.from({ length: Math.floor(hotel.rating) }, (_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  {hotel.rating % 1 > 0 && <Star className="w-4 h-4 text-gray-200" />}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {reviewStats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase">
                    <span>{stat.label}</span>
                    <span>{stat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gray-700 h-full rounded-full" style={{ width: `${stat.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities — from actual hotel data */}
          <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.amenities.map((amenity) => {
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

          {/* Location */}
          <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Location</h2>
            <div className="w-full h-96 bg-gray-100 rounded-xl overflow-hidden relative shadow-inner border border-gray-200 z-0">
              <HotelLocationMap hotelName={hotel.name} />
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">User Reviews</h2>
              <button className="text-orange-600 font-bold text-sm hover:underline">Write a Review</button>
            </div>
            <div className="space-y-6">
              {mockReviews.map((review, idx) => (
                <div key={idx} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                        {review.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                        <p className="text-xs text-gray-400 font-bold">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
                      {review.rating} <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pl-[52px]">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar hotels */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Similar Hotels Recommended For You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {similar.map((h) => (
                <Link key={h.id} href={`/hotels/${h.id}`} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition group">
                  <div className="h-40 overflow-hidden relative">
                    <Image
                      src={h.image}
                      alt={h.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-[10px] font-bold text-gray-800">
                      {h.rating.toFixed(1)} ★
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-gray-900">{h.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> India
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-lg font-bold text-gray-900">₹{h.price}</span>
                        <span className="text-xs text-gray-400 line-through ml-1">₹{Math.round(h.price * 1.5)}</span>
                      </div>
                      <span className="text-xs font-bold text-orange-600">View Details →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Hotel policies */}
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

        {/* RIGHT SIDEBAR — single BookingPanel instance handles mobile footer + desktop sidebar */}
        <div className="lg:col-span-4" id="booking">
          <HotelBookingPanel basePrice={basePrice} hotelId={hotel.id} plans={plans} />
        </div>
      </main>
    </div>
  );
}
