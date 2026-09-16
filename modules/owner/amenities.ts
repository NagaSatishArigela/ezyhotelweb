import type { PropertyType } from "@/store/onboardingSlice";

export interface AmenitySet {
  common: string[];
  specific: string[];
  compliance: string[];
}

export const AMENITY_DATA: Record<PropertyType | "other", AmenitySet> = {
  hotel: {
    common: ["WiFi", "Air Conditioning", "Power Backup", "Parking", "CCTV / Security", "Housekeeping", "Hot Water / Geyser", "Wheelchair Accessible"],
    specific: ["Room Service (24×7)", "Gym / Fitness Center", "Conference / Meeting Room", "Lift / Elevator", "Front Desk (24×7)", "EV Charging"],
    compliance: ["Restaurant on Premises → FSSAI required", "Bar / Lounge → Liquor License", "Fire Safety Cert (always required)"],
  },
  resort: {
    common: ["WiFi", "Air Conditioning", "Power Backup", "Parking", "CCTV / Security", "Daily Housekeeping", "Hot Water", "Wheelchair Accessible"],
    specific: ["Swimming Pool", "Kids Pool", "Spa & Wellness Center", "Beach / Lake View", "Multi-Cuisine Restaurant", "Buffet Breakfast", "Bar / Lounge", "Gym / Fitness Center", "Yoga / Meditation Area", "Kids Play Area", "Event / Wedding Space", "Conference Hall"],
    compliance: ["Restaurant → FSSAI required", "Bar / Lounge → Liquor License", "Pool / Kids Pool → Pool Safety Cert", "Fire Safety Cert"],
  },
  homestay: {
    common: ["WiFi", "Parking", "Power Backup", "CCTV / Security", "Hot Water / Geyser"],
    specific: ["Private Garden / Lawn", "Farm / Plantation Area", "Lake / River / Hill View", "Cycling", "Fully/Semi Equipped Kitchen", "Self-Cooking Allowed", "Kids Play Area"],
    compliance: ["Meals Provided → FSSAI if commercial", "Fire Safety Cert"],
  },
  villa: {
    common: ["WiFi", "Air Conditioning", "Power Backup", "Parking", "CCTV / Security", "Daily Housekeeping", "Hot Water"],
    specific: ["Private Pool", "BBQ / Grill Setup", "Fully/Semi Equipped Kitchen", "Chef on Request", "Indoor Games", "Private Cinema Room", "Balcony with View", "Beachfront"],
    compliance: ["Private Pool → Pool Safety Cert", "Fire Safety Cert"],
  },
  pg: {
    common: ["WiFi", "Power Backup", "CCTV Surveillance", "24×7 Water Supply", "Fire Safety Cert", "Geyser (Hot Water)"],
    specific: ["Furnished Room", "Wardrobe / Cupboard", "Study Table & Chair", "Air Conditioner", "Attached / Shared Bathroom", "Daily Meals (Veg / Non-Veg)", "Laundry / Washing Machine", "Parking (Bike / Car)"],
    compliance: ["Meals Provided → FSSAI (if > 5 persons)", "Fire Safety Cert"],
  },
  farm: {
    common: ["Parking", "Power Backup", "Water Supply", "Caretaker / Security", "Lighting Setup"],
    specific: ["Private Farmhouse", "Large Lawn / Garden", "Swimming Pool", "Rain Dance Setup", "Party Lawn", "BBQ / Grill Setup", "Fully/Semi Equipped Kitchen", "Cricket Ground", "Farm Animals Interaction"],
    compliance: ["Pool → Pool Safety Cert", "Fire Safety Cert"],
  },
  banquet: {
    common: ["AC Hall", "Power Backup", "Dedicated Parking", "Fire Safety Cert", "CCTV Surveillance", "Clean Washrooms", "Wheelchair Accessible"],
    specific: ["Indoor Hall / Outdoor Lawn", "Stage Setup", "Custom Decoration", "Wedding Mandap Setup", "DJ / Music System", "Projector / LED Screen", "In-house Catering", "Veg / Non-Veg Options", "Dressing / Changing Rooms"],
    compliance: ["In-house Catering → FSSAI required", "Fire Safety Cert", "Liquor License (if bar present)"],
  },
  other: {
    common: ["WiFi", "Parking", "Power Backup", "CCTV / Security", "Hot Water"],
    specific: ["Air Conditioning", "Housekeeping", "Lift / Elevator"],
    compliance: ["Fire Safety Cert"],
  },
};

export const REQUIRES_FSSAI = ["Restaurant on Premises → FSSAI required", "In-house Catering → FSSAI required", "Bar / Lounge → Liquor License", "Restaurant → FSSAI required", "Meals Provided → FSSAI if commercial", "Meals Provided → FSSAI (if > 5 persons)"];
export const REQUIRES_POOL_SAFETY = ["Swimming Pool", "Kids Pool", "Private Pool", "Pool / Kids Pool → Pool Safety Cert", "Pool → Pool Safety Cert"];
