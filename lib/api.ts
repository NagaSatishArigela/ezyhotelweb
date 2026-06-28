const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Request helper ──────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<T> {
  const callerHeaders: Record<string, string> =
    options.headers && typeof options.headers === "object" && !Array.isArray(options.headers)
      ? Object.fromEntries(
          Object.entries(options.headers).filter(([, v]) => typeof v === "string")
        )
      : {};
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...callerHeaders,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // NestJS can return message as a string or string[] (validation errors)
    const raw = body?.message ?? body?.error ?? `Request failed: ${res.status}`;
    const message: string = Array.isArray(raw) ? raw[0] : String(raw);
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Response types (matching quicknestserver contract) ─────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number; // seconds — 900 for access token
}

export interface ServerUser {
  id: string;
  phone: string;
  email: string;
  globalRole: "USER" | "ADMIN" | "SUPER_ADMIN";
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  status: "active" | "suspended" | "deleted";
  refreshTokenExpiresAt: string;
  createdAt: string;
  updatedAt: string;
}

// POST /auth/send-otp
export interface SendOtpResponse {
  message: string;
  expiresIn: number;
  resendAfter: number;
}

// POST /auth/verify-otp — two possible shapes
export type VerifyOtpResponse =
  | {
      needsRegistration: true;
      message: string;
      verificationToken: string;
      verificationType: "OTP";
    }
  | {
      needsRegistration: false;
      user: ServerUser;
      tokens: AuthTokens;
    };

// POST /auth/register
export interface RegisterResponse {
  user: ServerUser;
  tokens: AuthTokens;
}

// POST /auth/login
export interface LoginResponse {
  user: ServerUser;
  tokens: AuthTokens;
}

// GET /auth/me — returns a subset of ServerUser (no token/session fields)
export interface MeResponse {
  id: string;
  phone: string;
  email: string;
  globalRole: "USER" | "ADMIN" | "SUPER_ADMIN";
}

// GET /me/onboarding
export interface OnboardingResponse {
  status: "READY" | "NOT_APPLICABLE";
  canOnboardProperty: boolean;
  isAdmin: boolean;
  nextStep: "CREATE_PROPERTY" | "ADMIN_DASHBOARD";
}

// ── Auth API ───────────────────────────────────────────────────────────────

export const authApi = {
  sendOtp(phone: string): Promise<SendOtpResponse> {
    return request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  verifyOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
    return request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    });
  },

  register(
    verificationToken: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ verificationToken, email, password }),
    });
  },

  login(email: string, password: string): Promise<LoginResponse> {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  me(accessToken: string): Promise<MeResponse> {
    return request("/auth/me", { method: "GET" }, accessToken);
  },

  onboarding(accessToken: string): Promise<OnboardingResponse> {
    return request("/me/onboarding", { method: "GET" }, accessToken);
  },

  // Response is flat AuthTokens (not wrapped in { tokens: ... })
  refreshToken(refreshToken: string): Promise<AuthTokens> {
    return request("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  logout(refreshToken: string, accessToken: string): Promise<{ message: string }> {
    return request(
      "/auth/logout",
      { method: "POST", body: JSON.stringify({ refreshToken }) },
      accessToken
    );
  },
};

// ── Properties (owner onboarding) API ───────────────────────────────────────

export type PropertyStatus =
  | "draft"
  | "pending_review"
  | "needs_revision"
  | "approved"
  | "rejected"
  | "suspended";

// Mirrors Prisma's DocumentType enum (compliance schema)
export type DocumentType =
  | "owner_photo"
  | "id_proof"
  | "pan_card"
  | "gstin_certificate"
  | "rental_agreement"
  | "fire_safety_cert"
  | "fssai_license"
  | "trade_license"
  | "other";

export interface PropertyDocumentWizardDto {
  type: DocumentType;
  url: string;
  expiresAt?: string;
}

export interface ComplianceDocumentSummary {
  type: string;
  status: string;
  expiresAt: string | null;
}

export interface ComplianceSummary {
  legalBusinessName: string;
  gstinMasked: string;
  panMasked: string;
  bankAccountNumberMasked: string;
  ifsc: string;
  accountHolderName: string;
  documents: ComplianceDocumentSummary[];
}

// POST /properties/draft
export interface CreateDraftResult {
  propertyId: string;
}

// GET /properties/:id/draft
export interface DraftView {
  propertyId: string;
  status: PropertyStatus;
  draftStep: number | null;
  draftData: Record<string, unknown>;
  compliance: ComplianceSummary | null;
}

// PATCH /properties/:id/step/:stepNum
export interface SaveStepResult {
  propertyId: string;
  draftStep: number | null;
  draftData: Record<string, unknown>;
  compliance?: ComplianceSummary;
}

// POST /properties/:id/submit, PATCH /properties/:id/revise
export interface SubmitResult {
  propertyId: string;
  status: PropertyStatus;
  submissionRef: string;
  submittedAt: string;
}

export interface TimelineEntry {
  label: string;
  status: "done" | "current" | "pending";
  at: string | null;
}

// GET /properties/:id/status
export interface StatusView {
  status: PropertyStatus;
  submissionRef: string | null;
  submittedAt: string | null;
  revisionCount: number;
  revisionNotes: unknown;
  timeline: TimelineEntry[];
}

export const propertiesApi = {
  createDraft(accessToken: string): Promise<CreateDraftResult> {
    return request("/properties/draft", { method: "POST" }, accessToken);
  },

  getDraft(accessToken: string, propertyId: string): Promise<DraftView> {
    return request(`/properties/${propertyId}/draft`, { method: "GET" }, accessToken);
  },

  saveStep(
    accessToken: string,
    propertyId: string,
    stepNum: number,
    data: object
  ): Promise<SaveStepResult> {
    return request(
      `/properties/${propertyId}/step/${stepNum}`,
      { method: "PATCH", body: JSON.stringify(data) },
      accessToken
    );
  },

  submit(accessToken: string, propertyId: string): Promise<SubmitResult> {
    return request(`/properties/${propertyId}/submit`, { method: "POST" }, accessToken);
  },

  getStatus(accessToken: string, propertyId: string): Promise<StatusView> {
    return request(`/properties/${propertyId}/status`, { method: "GET" }, accessToken);
  },

  revise(accessToken: string, propertyId: string): Promise<SubmitResult> {
    return request(`/properties/${propertyId}/revise`, { method: "PATCH" }, accessToken);
  },
};

// ── Owner Notifications API ─────────────────────────────────────────────────

export type NotificationType =
  | "status_change"
  | "revision_request"
  | "approval"
  | "rejection"
  | "document_verified"
  | "general";

export interface OwnerNotification {
  id: string;
  ownerId: string;
  propertyId: string | null;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

// GET /owners/me/notifications
export interface NotificationListResult {
  items: OwnerNotification[];
  total: number;
  page: number;
  limit: number;
  unreadCount: number;
}

// ── Public Properties (guest discovery) API ────────────────────────────────

export type PublicPropertyType =
  | "hotel"
  | "resort"
  | "homestay"
  | "villa"
  | "pg"
  | "farm";

export type PublicPropertyCategory = "budget" | "mid" | "premium";

export type PublicBookingPolicy = "hourly" | "fullday" | "both";

export type RoomTypeCategory = "ac" | "nonac" | "dorm" | "suite";

export interface PublicPropertySummary {
  id: string;
  name: string;
  city: string | null;
  area: string | null;
  description: string | null;
  propertyType: PublicPropertyType | null;
  category: PublicPropertyCategory | null;
  bookingPolicy: PublicBookingPolicy | null;
  amenities: string[];
  minBookingHours: number | null;
  primaryImageUrl: string | null;
  startingHourlyRatePaise: number | null;
  startingFulldayRatePaise: number | null;
}

export interface PublicRoomType {
  id: string;
  type: RoomTypeCategory;
  count: number;
  hourlyRatePaise: number | null;
  fulldayRatePaise: number | null;
  maxOccupancy: number | null;
}

export interface PublicPhoto {
  url: string;
  category: string;
  isPrimary: boolean;
}

export interface PublicPropertyDetail extends PublicPropertySummary {
  addressLine1: string | null;
  addressLine2: string | null;
  state: string | null;
  pincode: string | null;
  landmark: string | null;
  latitude: number | null;
  longitude: number | null;
  defaultCheckinTime: string | null;
  defaultCheckoutTime: string | null;
  roomTypes: PublicRoomType[];
  photos: PublicPhoto[];
}

// GET /properties/public
export interface PublicPropertyListResult {
  items: PublicPropertySummary[];
  total: number;
  page: number;
  limit: number;
}

export type PublicPropertySort = "relevance" | "price_asc" | "price_desc" | "newest";

export interface PublicPropertyListParams {
  page?: number;
  limit?: number;
  q?: string;
  city?: string;
  minPrice?: number; // paise
  maxPrice?: number; // paise
  amenities?: string;
  sort?: PublicPropertySort;
}

export const publicPropertiesApi = {
  list(params: PublicPropertyListParams = {}): Promise<PublicPropertyListResult> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.q) query.set("q", params.q);
    if (params.city) query.set("city", params.city);
    if (params.minPrice != null) query.set("minPrice", String(params.minPrice));
    if (params.maxPrice != null) query.set("maxPrice", String(params.maxPrice));
    if (params.amenities) query.set("amenities", params.amenities);
    if (params.sort) query.set("sort", params.sort);
    const qs = query.toString();
    return request(`/properties/public${qs ? `?${qs}` : ""}`, { method: "GET" });
  },

  getById(propertyId: string): Promise<PublicPropertyDetail> {
    return request(`/properties/public/${propertyId}`, { method: "GET" });
  },
};

// ── Bookings API ─────────────────────────────────────────────────────────────

export type BookingType = "hourly" | "fullday";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "checked_in"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface Booking {
  id: string;
  bookingRef: string;
  propertyId: string;
  roomTypeId: string;
  ownerId: string;
  guestId: string;
  bookingType: BookingType;
  checkInAt: string;
  checkOutAt: string;
  durationHours: number;
  guestCount: number;
  baseAmountPaise: number;
  gstAmountPaise: number;
  platformFeePaise: number;
  totalAmountPaise: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentRef: string | null;
  qrCode: string | null;
  checkedInAt: string | null;
  checkedOutAt: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancelReason: string | null;
  refundAmountPaise: number | null;
  noShowAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// POST /bookings
export interface CreateBookingDto {
  propertyId: string;
  roomTypeId: string;
  bookingType: BookingType;
  checkInAt: string;
  durationHours?: number;
  guestCount: number;
}

// POST /bookings/:id/payment/confirm
export interface PaymentConfirmDto {
  success: boolean;
  paymentRef?: string;
}

// POST /bookings/:id/cancel
export interface CancelBookingDto {
  reason?: string;
}

// GET /properties/:propertyId/availability
export interface AvailabilityResult {
  roomTypeId: string;
  date: string;
  totalRooms: number;
  bookedIntervals: { checkInAt: string; checkOutAt: string }[];
}

// GET /me/bookings
export interface MyBookingsResult {
  items: Booking[];
  total: number;
  page: number;
  limit: number;
}

export const bookingsApi = {
  getAvailability(propertyId: string, roomTypeId: string, date: string): Promise<AvailabilityResult> {
    const query = new URLSearchParams({ roomTypeId, date });
    return request(`/properties/${propertyId}/availability?${query.toString()}`, { method: "GET" });
  },

  create(accessToken: string, dto: CreateBookingDto): Promise<Booking> {
    return request("/bookings", { method: "POST", body: JSON.stringify(dto) }, accessToken);
  },

  get(accessToken: string, bookingId: string): Promise<Booking> {
    return request(`/bookings/${bookingId}`, { method: "GET" }, accessToken);
  },

  confirmPayment(accessToken: string, bookingId: string, dto: PaymentConfirmDto): Promise<Booking> {
    return request(
      `/bookings/${bookingId}/payment/confirm`,
      { method: "POST", body: JSON.stringify(dto) },
      accessToken
    );
  },

  checkIn(accessToken: string, bookingId: string, qrCode: string): Promise<Booking> {
    return request(`/bookings/${bookingId}/check-in`, { method: "POST", body: JSON.stringify({ qrCode }) }, accessToken);
  },

  checkOut(accessToken: string, bookingId: string): Promise<Booking> {
    return request(`/bookings/${bookingId}/check-out`, { method: "POST", body: JSON.stringify({}) }, accessToken);
  },

  cancel(accessToken: string, bookingId: string, dto: CancelBookingDto = {}): Promise<Booking> {
    return request(`/bookings/${bookingId}/cancel`, { method: "POST", body: JSON.stringify(dto) }, accessToken);
  },

  myBookings(
    accessToken: string,
    params: { status?: BookingStatus; page?: number; limit?: number } = {}
  ): Promise<MyBookingsResult> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return request(`/me/bookings${qs ? `?${qs}` : ""}`, { method: "GET" }, accessToken);
  },
};

export const notificationsApi = {
  list(
    accessToken: string,
    params: { unread?: boolean; page?: number; limit?: number } = {}
  ): Promise<NotificationListResult> {
    const query = new URLSearchParams();
    if (params.unread) query.set("unread", "true");
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return request(
      `/owners/me/notifications${qs ? `?${qs}` : ""}`,
      { method: "GET" },
      accessToken
    );
  },

  markRead(accessToken: string, notificationId: string): Promise<OwnerNotification> {
    return request(
      `/owners/me/notifications/${notificationId}/read`,
      { method: "PATCH" },
      accessToken
    );
  },
};

// ── Guest Reviews API ────────────────────────────────────────────────────────

export interface GuestReview {
  id: string;
  bookingId: string;
  propertyId: string;
  guestId: string;
  rating: number;
  reviewText: string | null;
  status: "published" | "flagged" | "removed";
  createdAt: string;
  guest?: { name: string | null };
}

export interface ReviewListResult {
  items: GuestReview[];
  total: number;
  page: number;
  limit: number;
}

export interface PropertyRatingSummary {
  propertyId: string;
  averageRating: number | null;
  totalReviews: number;
  distribution: Record<string, number>;
}

export interface SubmitReviewDto {
  bookingId: string;
  rating: number;
  reviewText?: string;
}

export const guestReviewsApi = {
  listForProperty(propertyId: string, page = 1, limit = 10): Promise<ReviewListResult> {
    const query = new URLSearchParams({ page: String(page), limit: String(limit) });
    return request(`/properties/${propertyId}/reviews?${query}`, { method: "GET" });
  },

  summary(propertyId: string): Promise<PropertyRatingSummary> {
    return request(`/properties/${propertyId}/reviews/summary`, { method: "GET" });
  },

  submit(accessToken: string, dto: SubmitReviewDto): Promise<GuestReview> {
    return request("/reviews", { method: "POST", body: JSON.stringify(dto) }, accessToken);
  },

  pending(accessToken: string): Promise<{ bookings: { bookingId: string; propertyId: string; propertyName: string; checkOutAt: string }[] }> {
    return request("/reviews/pending", { method: "GET" }, accessToken);
  },
};

// ── Guest Disputes API ───────────────────────────────────────────────────────

export interface FileDisputeDto {
  category: "room_quality" | "cleanliness" | "amenities" | "staff" | "safety" | "charges" | "other";
  description: string;
  requestedResolution: "full_refund" | "partial_refund" | "replacement" | "apology" | "other";
  evidence?: string[];
}

export const guestDisputesApi = {
  file(accessToken: string, bookingId: string, dto: FileDisputeDto): Promise<{ id: string; disputeRef: string }> {
    return request(`/bookings/${bookingId}/disputes`, { method: "POST", body: JSON.stringify(dto) }, accessToken);
  },
};
