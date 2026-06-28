export const PROPERTY_TYPE_VALUES = [
  "hotel", "resort", "homestay", "villa", "pg", "farm", "banquet", "other",
] as const;

export type PropertyType = typeof PROPERTY_TYPE_VALUES[number];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
  "Andaman & Nicobar Islands", "Dadra & Nagar Haveli", "Lakshadweep",
] as const;

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  hotel: "Hotel",
  resort: "Resort",
  homestay: "Homestay",
  villa: "Villa",
  pg: "PG",
  farm: "Farm House",
  banquet: "Banquet Hall",
  other: "Other",
};
