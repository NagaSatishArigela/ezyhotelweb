import { z } from "zod";

// Step 0 — Owner registration
// OTP is verified via local state before submit is enabled — not part of form schema.
export const ownerAuthSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Enter a valid 10-digit phone number"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Minimum 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[!@#$%^&*]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Step 1 — Basics
export const step1Schema = z.object({
  propertyName: z.string().min(3).max(100),
  propertyType: z.enum(["hotel", "resort", "homestay", "villa", "pg", "farm", "banquet", "other"]),
  bookingPolicy: z.enum(["hourly", "fullday", "both"]),
  ownerFirstName: z.string().min(2).max(50).regex(/^[A-Za-z]+$/, "Letters only"),
  ownerMiddleName: z.string().max(50).optional(),
  ownerLastName: z.string().min(2).max(50).regex(/^[A-Za-z]+$/, "Letters only"),
  category: z.enum(["budget", "mid", "premium"]),
  description: z.string().max(200).optional(),
});

// Step 2 — Location
export const step2Schema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  addressLine1: z.string().min(5).max(150),
  addressLine2: z.string().min(5).max(300),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  city: z.string().min(2).max(80),
  state: z.string().min(2),
  landmark: z.string().max(100).optional(),
  specialNote: z.string().max(200).optional(),
});

// Step 3 — Rooms & Pricing
export const roomTypeSchema = z.object({
  type: z.enum(["ac", "nonac", "dorm", "suite"]),
  count: z.number().int().min(0).max(500),
  hourlyRate: z.number().min(100).max(100000).optional(),
  fulldayRate: z.number().min(500).max(500000).optional(),
  maxOccupancy: z.number().int().min(1).max(20).optional(),
});

export const step3Schema = z.object({
  rooms: z.array(roomTypeSchema).refine(
    (rooms) => rooms.some((r) => r.count > 0),
    { message: "At least one room type must have a count greater than 0" }
  ),
  minBookingHours: z.enum(["1", "2", "3"]).optional(),
  defaultCheckinTime: z.string().optional(),
  defaultCheckoutTime: z.string().optional(),
  seatingCapacity: z.number().int().min(50).max(5000).optional(),
});

// Step 3B — Amenities
export const step3bSchema = z.object({
  amenities: z.array(z.string()).min(1, "Select at least one amenity"),
});

// Step 3C — House Rules
export const step3cSchema = z.object({
  couple_friendly: z.enum(["yes", "no", "on_request"]),
  pet_friendly: z.enum(["yes", "no", "on_request"]),
  party_allowed: z.enum(["yes", "no", "on_request"]),
  alcohol_allowed: z.enum(["yes", "no", "not_allowed"]),
  smoking_allowed: z.enum(["yes", "no", "designated_area"]),
  bachelor_groups: z.enum(["yes", "no"]),
  id_proof_required: z.enum(["yes", "no"]),
  outside_food: z.enum(["yes", "no", "on_request"]),
  noiseCutoffTime: z.string().optional(),
  alcoholPolicyNote: z.string().max(200).optional(),
});

// Step 5 — Legal & Payout
export const step5Schema = z.object({
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GSTIN format"),
  legalBusinessName: z.string().min(2).max(200),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),
  bankAccountNumber: z.string().regex(/^\d{9,18}$/, "Enter 9–18 digit account number"),
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC format"),
  accountHolderName: z.string().min(2).max(100),
  tcAccepted: z.literal(true, { message: "You must accept the Terms & Conditions" }),
  formCAcknowledged: z.literal(true, { message: "You must acknowledge Form C obligations" }),
});

export type OwnerAuthForm = z.infer<typeof ownerAuthSchema>;
export type Step1Form = z.infer<typeof step1Schema>;
export type Step2Form = z.infer<typeof step2Schema>;
export type Step3Form = z.infer<typeof step3Schema>;
export type Step3bForm = z.infer<typeof step3bSchema>;
export type Step3cForm = z.infer<typeof step3cSchema>;
export type Step5Form = z.infer<typeof step5Schema>;
