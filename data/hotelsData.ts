import type { Hotel } from "@/types";

export const hotelsData: Hotel[] = [
  // Bangalore (1–8)
  { id: 1, name: "The Grand Oasis", city: "Bangalore", area: "Koramangala", price: 50, rating: 4.8, reviews: 120, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAK_Z8mLWjt3mB3skilQAkh2hHch24oMfSC9qLhKur_B0cr0kPZ8VEFEqUAIZBdW-TJLhKwOEinReCanobERH_Ya_HFbagphE-ReqMNvTyooYTwmRRkjAnDrYqGHNMntSZU8qYh1xW9Mjpc86OKhk2guNDILjYizAgnmGOl0UqmUS8sB6m4n0v7SCocP9AawY_anHq0IzfTvcEO0JXnGvD5ZNN_Vx7i8nFoWB7Wyka8atYQqCqpQBu9nP_siTIbBGTIxeacSn-ICqwX", amenities: ["WiFi", "AC", "Parking"] },
  { id: 2, name: "The Urban Retreat", city: "Bangalore", area: "Indiranagar", price: 40, rating: 4.5, reviews: 98, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt0vSNnVF6cNq-XXt2u-n_ATyP3KHRmzd7-RfVVhfc2hKMVgHl2nETTNMWHOGmGP3_LjKNHUEcJHyjIrSlrauQKfSNWSrMzJuQuekxHB5XpgPo89QGZcGcvON5m38dA-YZCTb7GJZj_S-KBfSeZ1JX1K5EyNib1A8Vv8Kh4o0FwWwQIyuB96dbbdMuZxo4BXUUHnFHWwgvwpsCEGBRwHvsgUrKi1S9YY2Ub01G9f0U-FTyOSYU4jhfe-NTPQ-1S_fbYvPPoeL9ZGKo", amenities: ["AC", "Parking"] },
  { id: 3, name: "The Coastal Breeze", city: "Bangalore", area: "Whitefield", price: 60, rating: 4.9, reviews: 210, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM2o1Dqza5MDglcZk-Is5mqh0FmTH8arLHIlTQ0GKhqUQiP_93edD5TDwtZMsPTs3qjgK-SLpPdcqDQhYpN2Ol-eRbIVGTUSNmCBnUaXUgCAibxxxTsbSps-X_B_bNod7Rn1xwEW4e_wYmK1vi2bezJXFHzmFN6uWQY-Mq9NhsPiBPU0jfh2z_neB_874RcAMUr045oslnDHuFwsli5ygFRJXx1oTyJQCgaC_lbXizxUw6NXdTUQfphT7oLAsy3cIurPGKqHpu1", amenities: ["WiFi", "AC", "Parking", "Couples Allowed"] },
  { id: 4, name: "Sunset Haven Resort", city: "Bangalore", area: "MG Road", price: 120, rating: 4.7, reviews: 350, image: "https://picsum.photos/seed/4/800/600", amenities: ["WiFi", "Pool", "Spa", "Restaurant"] },
  { id: 5, name: "The Budget Inn", city: "Bangalore", area: "JP Nagar", price: 25, rating: 3.5, reviews: 55, image: "https://picsum.photos/seed/5/800/600", amenities: ["AC", "Parking"] },
  { id: 6, name: "Luxury Suites Downtown", city: "Bangalore", area: "HSR Layout", price: 180, rating: 5.0, reviews: 500, image: "https://picsum.photos/seed/6/800/600", amenities: ["WiFi", "AC", "Pool", "Restaurant", "Gym"] },
  { id: 7, name: "Riverside Lodge", city: "Bangalore", area: "Marathahalli", price: 75, rating: 4.2, reviews: 15, image: "https://picsum.photos/seed/7/800/600", amenities: ["WiFi", "Parking", "Pet Friendly"] },
  { id: 8, name: "Mountain View Hotel", city: "Bangalore", area: "Koramangala", price: 90, rating: 4.6, reviews: 180, image: "https://picsum.photos/seed/8/800/600", amenities: ["AC", "Parking", "Restaurant"] },

  // Mumbai (9–15)
  { id: 9, name: "Seaside Villas", city: "Mumbai", area: "Bandra", price: 150, rating: 4.9, reviews: 400, image: "https://picsum.photos/seed/9/800/600", amenities: ["WiFi", "Pool", "Beach Access"] },
  { id: 10, name: "Economy Hostel", city: "Mumbai", area: "Andheri", price: 15, rating: 3.1, reviews: 80, image: "https://picsum.photos/seed/10/800/600", amenities: ["WiFi"] },
  { id: 11, name: "The Corporate Stay", city: "Mumbai", area: "Powai", price: 110, rating: 4.4, reviews: 215, image: "https://picsum.photos/seed/11/800/600", amenities: ["WiFi", "AC", "Gym", "Business Center"] },
  { id: 12, name: "The Quiet Corner", city: "Mumbai", area: "Colaba", price: 65, rating: 4.1, reviews: 60, image: "https://picsum.photos/seed/12/800/600", amenities: ["Parking", "Couples Allowed"] },
  { id: 13, name: "Family Fun Resort", city: "Mumbai", area: "Borivali", price: 130, rating: 4.8, reviews: 620, image: "https://picsum.photos/seed/13/800/600", amenities: ["WiFi", "Pool", "Kids Club", "Restaurant"] },
  { id: 14, name: "Roadside Motel", city: "Mumbai", area: "Dadar", price: 35, rating: 3.8, reviews: 105, image: "https://picsum.photos/seed/14/800/600", amenities: ["AC", "Parking", "Pet Friendly"] },
  { id: 15, name: "The Posh Pad", city: "Mumbai", area: "Kurla", price: 250, rating: 5.0, reviews: 750, image: "https://picsum.photos/seed/15/800/600", amenities: ["WiFi", "AC", "Spa", "Valet Parking"] },

  // Delhi (16–22)
  { id: 16, name: "Heritage Manor", city: "Delhi", area: "Connaught Place", price: 100, rating: 4.3, reviews: 95, image: "https://picsum.photos/seed/16/800/600", amenities: ["WiFi", "Restaurant", "Parking"] },
  { id: 17, name: "Lake View Inn", city: "Delhi", area: "Lajpat Nagar", price: 85, rating: 4.5, reviews: 205, image: "https://picsum.photos/seed/17/800/600", amenities: ["WiFi", "AC", "Couples Allowed"] },
  { id: 18, name: "The Modern Apartment", city: "Delhi", area: "Karol Bagh", price: 55, rating: 4.0, reviews: 45, image: "https://picsum.photos/seed/18/800/600", amenities: ["WiFi", "Kitchenette"] },
  { id: 19, name: "Zen Garden Hotel", city: "Delhi", area: "Hauz Khas", price: 140, rating: 4.7, reviews: 300, image: "https://picsum.photos/seed/19/800/600", amenities: ["WiFi", "Spa", "Pool"] },
  { id: 20, name: "Traveler's Stop", city: "Delhi", area: "Paharganj", price: 30, rating: 3.7, reviews: 75, image: "https://picsum.photos/seed/20/800/600", amenities: ["AC"] },
  { id: 21, name: "City Central Hotel", city: "Delhi", area: "Saket", price: 95, rating: 4.4, reviews: 280, image: "https://picsum.photos/seed/21/800/600", amenities: ["WiFi", "AC", "Gym"] },
  { id: 22, name: "The Guesthouse", city: "Delhi", area: "Rohini", price: 45, rating: 3.9, reviews: 90, image: "https://picsum.photos/seed/22/800/600", amenities: ["Parking", "Pet Friendly"] },

  // Hyderabad (23–29)
  { id: 23, name: "Exclusive Heights", city: "Hyderabad", area: "Banjara Hills", price: 200, rating: 4.9, reviews: 480, image: "https://picsum.photos/seed/23/800/600", amenities: ["WiFi", "AC", "Pool", "Valet Parking", "Restaurant"] },
  { id: 24, name: "Green Fields Stay", city: "Hyderabad", area: "Jubilee Hills", price: 70, rating: 4.2, reviews: 130, image: "https://picsum.photos/seed/24/800/600", amenities: ["WiFi", "Parking"] },
  { id: 25, name: "Oceanfront Deluxe", city: "Hyderabad", area: "Gachibowli", price: 160, rating: 4.6, reviews: 320, image: "https://picsum.photos/seed/25/800/600", amenities: ["WiFi", "AC", "Beach Access", "Restaurant"] },
  { id: 26, name: "Tiny Town Hotel", city: "Hyderabad", area: "Madhapur", price: 50, rating: 4.0, reviews: 50, image: "https://picsum.photos/seed/26/800/600", amenities: ["Parking", "AC"] },
  { id: 27, name: "The Penthouse View", city: "Hyderabad", area: "Hitech City", price: 300, rating: 5.0, reviews: 800, image: "https://picsum.photos/seed/27/800/600", amenities: ["WiFi", "Spa", "Gym", "Valet Parking", "Couples Allowed"] },
  { id: 28, name: "Budget Backpacker", city: "Hyderabad", area: "Secunderabad", price: 20, rating: 3.0, reviews: 40, image: "https://picsum.photos/seed/28/800/600", amenities: ["WiFi"] },
  { id: 29, name: "Tech Hub Residence", city: "Hyderabad", area: "Kondapur", price: 105, rating: 4.5, reviews: 230, image: "https://picsum.photos/seed/29/800/600", amenities: ["WiFi", "Business Center", "Gym"] },

  // Chennai (30–36)
  { id: 30, name: "Old World Charm", city: "Chennai", area: "T. Nagar", price: 80, rating: 4.1, reviews: 110, image: "https://picsum.photos/seed/30/800/600", amenities: ["Restaurant", "Parking"] },
  { id: 31, name: "Artisan Quarters", city: "Chennai", area: "Adyar", price: 115, rating: 4.6, reviews: 290, image: "https://picsum.photos/seed/31/800/600", amenities: ["WiFi", "AC", "Couples Allowed"] },
  { id: 32, name: "Star Light Hotel", city: "Chennai", area: "Anna Nagar", price: 40, rating: 3.6, reviews: 65, image: "https://picsum.photos/seed/32/800/600", amenities: ["AC", "Parking"] },
  { id: 33, name: "Grand Ballroom Hotel", city: "Chennai", area: "Velachery", price: 190, rating: 4.8, reviews: 550, image: "https://picsum.photos/seed/33/800/600", amenities: ["WiFi", "AC", "Pool", "Restaurant", "Spa"] },
  { id: 34, name: "Cozy Corner B&B", city: "Chennai", area: "Mylapore", price: 60, rating: 4.3, reviews: 140, image: "https://picsum.photos/seed/34/800/600", amenities: ["WiFi", "Parking", "Pet Friendly"] },
  { id: 35, name: "Island Getaway", city: "Chennai", area: "ECR", price: 170, rating: 4.9, reviews: 420, image: "https://picsum.photos/seed/35/800/600", amenities: ["WiFi", "Beach Access", "Pool", "Restaurant"] },
  { id: 36, name: "Interstate Stop", city: "Chennai", area: "Porur", price: 30, rating: 3.4, reviews: 50, image: "https://picsum.photos/seed/36/800/600", amenities: ["Parking"] },

  // Pune (37–43)
  { id: 37, name: "Metro Residence", city: "Pune", area: "Koregaon Park", price: 125, rating: 4.7, reviews: 310, image: "https://picsum.photos/seed/37/800/600", amenities: ["WiFi", "AC", "Gym", "Business Center"] },
  { id: 38, name: "The Simple Stay", city: "Pune", area: "Kothrud", price: 55, rating: 4.0, reviews: 85, image: "https://picsum.photos/seed/38/800/600", amenities: ["AC", "Parking"] },
  { id: 39, name: "Desert Oasis Motel", city: "Pune", area: "Viman Nagar", price: 75, rating: 4.1, reviews: 160, image: "https://picsum.photos/seed/39/800/600", amenities: ["Pool", "AC"] },
  { id: 40, name: "The Skyscraper Inn", city: "Pune", area: "Baner", price: 145, rating: 4.5, reviews: 260, image: "https://picsum.photos/seed/40/800/600", amenities: ["WiFi", "AC", "Restaurant"] },
  { id: 41, name: "Hiker's Home Base", city: "Pune", area: "Shivajinagar", price: 65, rating: 4.3, reviews: 100, image: "https://picsum.photos/seed/41/800/600", amenities: ["Parking", "Pet Friendly"] },
  { id: 42, name: "Royal Palace Hotel", city: "Pune", area: "Camp", price: 220, rating: 5.0, reviews: 650, image: "https://picsum.photos/seed/42/800/600", amenities: ["WiFi", "Spa", "Pool", "Valet Parking", "Restaurant"] },
  { id: 43, name: "The Tiny Room", city: "Pune", area: "Hadapsar", price: 25, rating: 3.2, reviews: 30, image: "https://picsum.photos/seed/43/800/600", amenities: ["AC"] },

  // Gurgaon (44–50)
  { id: 44, name: "Midtown Loft", city: "Gurgaon", area: "Sector 29", price: 90, rating: 4.4, reviews: 190, image: "https://picsum.photos/seed/44/800/600", amenities: ["WiFi", "AC", "Couples Allowed"] },
  { id: 45, name: "Adventure Camp", city: "Gurgaon", area: "DLF Phase 1", price: 40, rating: 3.9, reviews: 70, image: "https://picsum.photos/seed/45/800/600", amenities: ["Parking", "Pet Friendly"] },
  { id: 46, name: "The Executive Club", city: "Gurgaon", area: "Cyber City", price: 160, rating: 4.8, reviews: 380, image: "https://picsum.photos/seed/46/800/600", amenities: ["WiFi", "AC", "Gym", "Business Center", "Restaurant"] },
  { id: 47, name: "Harbor View Suites", city: "Gurgaon", area: "Sohna Road", price: 135, rating: 4.6, reviews: 270, image: "https://picsum.photos/seed/47/800/600", amenities: ["WiFi", "Pool", "Parking"] },
  { id: 48, name: "Student Special", city: "Gurgaon", area: "Sector 14", price: 18, rating: 3.0, reviews: 25, image: "https://picsum.photos/seed/48/800/600", amenities: ["WiFi"] },
  { id: 49, name: "Romantic Hideaway", city: "Gurgaon", area: "Golf Course Road", price: 185, rating: 4.9, reviews: 450, image: "https://picsum.photos/seed/49/800/600", amenities: ["WiFi", "Spa", "Couples Allowed", "Pool"] },
  { id: 50, name: "The Last Resort", city: "Gurgaon", area: "MG Road", price: 80, rating: 4.2, reviews: 170, image: "https://picsum.photos/seed/50/800/600", amenities: ["AC", "Restaurant", "Parking"] },
];
