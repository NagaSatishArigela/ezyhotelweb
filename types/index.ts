export interface Hotel {
  id: number;
  name: string;
  city: string;
  area: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  amenities: string[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface HotelCardViewModel {
  id: number | string;
  displayName: string;
  city: string;
  location: string;
  priceLabel: string;
  originalPriceLabel: string;
  ratingLabel: string;
  reviewsLabel: string;
  amenityBadges: string[];
  hasMoreAmenities: boolean;
  imageUrl: string;
  isCoupleFriendly: boolean;
  bookingPolicy: "hourly" | "24h";
  priceSlots: { label: string; price: string }[];
  description: string;
}

export interface FilterParams {
  q?: string;
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string;
  rating?: string;
  sort?: "price_asc" | "price_desc" | "rating_desc" | "relevance";
  page?: string;
}

export interface HotelsPageViewModel {
  viewModels: HotelCardViewModel[];
  activeFilters: FilterParams;
  totalCount: number;
}

export interface Booking {
  id: string;
  hotelId: number;
  hotelName: string;
  hotelImage: string;
  city: string;
  area: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  guests: number;
  rooms: number;
  totalPrice: number;
  status: "confirmed" | "completed" | "cancelled";
  bookingRef: string;
  createdAt: string;
}
