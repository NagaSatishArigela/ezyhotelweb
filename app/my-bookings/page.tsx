"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays, Clock, MapPin, BedDouble, Users, ChevronRight,
  SearchX, Home, Hotel, CheckCircle, XCircle, AlertCircle, RefreshCw,
} from "lucide-react";
import type { Booking } from "@/types";
import { hotelsData } from "@/data/hotelsData";
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken, selectIsAuthenticated } from "@/store/selectors/authSelectors";
import {
  ApiError,
  Booking as ApiBooking,
  PublicPropertyDetail,
  bookingsApi,
  publicPropertiesApi,
} from "@/lib/api";
import WriteReviewModal from "@/components/client/WriteReviewModal";
import CancelBookingDialog from "@/components/client/CancelBookingDialog";

// Mock booking history
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1", hotelId: 1, hotelName: "The Grand Oasis", hotelImage: hotelsData[0].image,
    city: "Bangalore", area: "Koramangala",
    checkIn: "2026-04-27T12:00:00", checkOut: "2026-04-27T15:00:00",
    hours: 3, guests: 2, rooms: 1, totalPrice: 649, status: "confirmed",
    bookingRef: "PPH12345678", createdAt: "2026-04-26T10:30:00",
  },
  {
    id: "2", hotelId: 6, hotelName: "Luxury Suites Downtown", hotelImage: hotelsData[5].image,
    city: "Bangalore", area: "HSR Layout",
    checkIn: "2026-04-20T14:00:00", checkOut: "2026-04-20T20:00:00",
    hours: 6, guests: 2, rooms: 1, totalPrice: 3601, status: "completed",
    bookingRef: "PPH87654321", createdAt: "2026-04-19T18:00:00",
  },
  {
    id: "3", hotelId: 15, hotelName: "The Posh Pad", hotelImage: hotelsData[14].image,
    city: "Mumbai", area: "Kurla",
    checkIn: "2026-04-15T10:00:00", checkOut: "2026-04-15T13:00:00",
    hours: 3, guests: 1, rooms: 1, totalPrice: 2065, status: "cancelled",
    bookingRef: "PPH11223344", createdAt: "2026-04-14T09:00:00",
  },
];

const STATUS_CONFIG = {
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-50 border-red-200" },
};

const REAL_STATUS_CONFIG: Record<ApiBooking["status"], { label: string; icon: typeof CheckCircle; color: string; bg: string }> = {
  pending_payment: { label: "Pending Payment", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  confirmed: { label: "Confirmed", icon: CheckCircle, color: "text-green-600", bg: "bg-green-50 border-green-200" },
  checked_in: { label: "Checked In", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  completed: { label: "Completed", icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-50 border-red-200" },
  no_show: { label: "No Show", icon: XCircle, color: "text-red-500", bg: "bg-red-50 border-red-200" },
};

const ROOM_TYPE_LABELS: Record<string, string> = {
  ac: "AC Room",
  nonac: "Non-AC Room",
  dorm: "Dorm",
  suite: "Suite",
};

type FilterTab = "all" | "upcoming" | "completed" | "cancelled";

export default function MyBookingsPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector(selectAccessToken);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const [realBookings, setRealBookings] = useState<ApiBooking[]>([]);
  const [propertiesById, setPropertiesById] = useState<Map<string, PublicPropertyDetail>>(new Map());
  const [loadingReal, setLoadingReal] = useState(true);
  const [realError, setRealError] = useState<string | null>(null);

  // Modals
  const [cancelTarget, setCancelTarget] = useState<ApiBooking | null>(null);
  const [reviewTarget, setReviewTarget] = useState<ApiBooking | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!accessToken) return;
    let aborted = false;
    setLoadingReal(true);
    bookingsApi
      .myBookings(accessToken)
      .then(async (res) => {
        if (aborted) return;
        setRealBookings(res.items);
        const ids = Array.from(new Set(res.items.map((b) => b.propertyId)));
        const settled = await Promise.allSettled(ids.map((id) => publicPropertiesApi.getById(id)));
        if (aborted) return;
        const map = new Map<string, PublicPropertyDetail>();
        settled.forEach((result, i) => {
          if (result.status === 'fulfilled') map.set(ids[i], result.value);
          else console.warn(`[my-bookings] failed to load property ${ids[i]}:`, result.reason);
        });
        setPropertiesById(map);
      })
      .catch((e) => { if (!aborted) setRealError(e instanceof ApiError ? e.message : "Failed to load bookings."); })
      .finally(() => { if (!aborted) setLoadingReal(false); });
    return () => { aborted = true; };
  }, [accessToken]);

  const handleCancelConfirm = async (booking: ApiBooking, reason: string) => {
    if (!accessToken) return;
    try {
      const updated = await bookingsApi.cancel(accessToken, booking.id, { reason });
      setRealBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
      setCancelTarget(null);
    } catch (e) {
      setRealError(e instanceof ApiError ? e.message : "Failed to cancel booking.");
      setCancelTarget(null);
    }
  };

  if (!isAuthenticated) return null;

  // Combine real + mock for display — prefer real when available
  const hasReal = realBookings.length > 0;
  const displayBookings: ApiBooking[] = hasReal ? realBookings : [];

  const isUpcoming = (s: ApiBooking["status"]) => s === "pending_payment" || s === "confirmed" || s === "checked_in";
  const isCancelled = (s: ApiBooking["status"]) => s === "cancelled" || s === "no_show";

  const filteredReal = displayBookings.filter((b) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") return isUpcoming(b.status);
    if (activeTab === "completed") return b.status === "completed";
    if (activeTab === "cancelled") return isCancelled(b.status);
    return true;
  });

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all",       label: "All",       count: displayBookings.length },
    { id: "upcoming",  label: "Upcoming",  count: displayBookings.filter((b) => isUpcoming(b.status)).length },
    { id: "completed", label: "Completed", count: displayBookings.filter((b) => b.status === "completed").length },
    { id: "cancelled", label: "Cancelled", count: displayBookings.filter((b) => isCancelled(b.status)).length },
  ];

  const mockTabs: { id: FilterTab; label: string; count: number }[] = [
    { id: "all",       label: "All",       count: MOCK_BOOKINGS.length },
    { id: "upcoming",  label: "Upcoming",  count: MOCK_BOOKINGS.filter((b) => b.status === "confirmed").length },
    { id: "completed", label: "Completed", count: MOCK_BOOKINGS.filter((b) => b.status === "completed").length },
    { id: "cancelled", label: "Cancelled", count: MOCK_BOOKINGS.filter((b) => b.status === "cancelled").length },
  ];
  const filteredMock = activeTab === "all" ? MOCK_BOOKINGS
    : activeTab === "upcoming" ? MOCK_BOOKINGS.filter((b) => b.status === "confirmed")
    : MOCK_BOOKINGS.filter((b) => b.status === activeTab);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "2-digit", hour: "numeric", minute: "2-digit", hour12: true });

  const displayTabs = hasReal ? tabs : mockTabs;
  const totalCount = hasReal ? displayBookings.length : MOCK_BOOKINGS.length;

  const renderRealBookingCard = (booking: ApiBooking) => {
    const status = REAL_STATUS_CONFIG[booking.status];
    const StatusIcon = status.icon;
    const property = propertiesById.get(booking.propertyId);
    const roomType = property?.roomTypes.find((r) => r.id === booking.roomTypeId);
    const checkIn = new Date(booking.checkInAt);
    const checkOut = new Date(booking.checkOutAt);
    const canCancel = booking.status === "pending_payment" || booking.status === "confirmed";
    const isCompleted = booking.status === "completed";
    const isCancelledStatus = booking.status === "cancelled" || booking.status === "no_show";
    const hasRefund = isCancelledStatus && booking.refundAmountPaise && booking.refundAmountPaise > 0;

    // Book Again URL — prefill with previous booking details
    const bookAgainParams = property
      ? new URLSearchParams({
          hours: String(booking.durationHours ?? 3),
          guests: String(booking.guestCount ?? 2),
          rooms: "1",
        }).toString()
      : "";

    return (
      <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className={`px-5 py-2.5 flex items-center justify-between border-b ${status.bg}`}>
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 tracking-widest">{booking.bookingRef}</span>
        </div>

        <div className="p-5 flex gap-4">
          {property?.primaryImageUrl && (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <Image src={property.primaryImageUrl} alt={property.name} fill className="object-cover" sizes="80px" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{property?.name ?? "Property"}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-orange-500 shrink-0" /> {[property?.area, property?.city].filter(Boolean).join(", ")}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Check-in</p>
                <p className="text-xs font-bold text-gray-700 flex items-center gap-1 mt-0.5">
                  <CalendarDays className="w-3 h-3 text-orange-400" /> {fmt(checkIn.toISOString())}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Check-out</p>
                <p className="text-xs font-bold text-gray-700 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-orange-400" /> {fmt(checkOut.toISOString())}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {roomType ? (ROOM_TYPE_LABELS[roomType.type] ?? roomType.type) : "Room"}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.guestCount} guests</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.bookingType === "hourly" ? `${booking.durationHours}h` : "Full day"}</span>
            </div>
            {/* Refund status for cancelled bookings */}
            {hasRefund && (
              <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600">
                <RefreshCw className="w-3 h-3" />
                Refund of ₹{Math.round(booking.refundAmountPaise! / 100)} initiated
                {booking.cancelledAt && ` on ${new Date(booking.cancelledAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
              </div>
            )}
            {isCancelledStatus && !hasRefund && (
              <div className="mt-2 text-xs text-gray-400 font-medium">No refund applicable per cancellation policy.</div>
            )}
          </div>
          <div className="shrink-0 flex flex-col items-end justify-between">
            <span className="text-lg font-black text-orange-600">₹{Math.round(booking.totalAmountPaise / 100)}</span>
            <Link href={`/booking-confirm/${booking.id}`} className="p-2 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
              <ChevronRight className="w-4 h-4 text-orange-500" />
            </Link>
          </div>
        </div>

        {(canCancel || isCompleted) && (
          <div className="px-5 pb-4 flex gap-2">
            {canCancel && (
              <>
                <Link
                  href={`/booking-confirm/${booking.id}`}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  View Details
                </Link>
                <button
                  onClick={() => setCancelTarget(booking)}
                  className="flex-1 py-2.5 text-xs font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Cancel Booking
                </button>
              </>
            )}
            {isCompleted && (
              <>
                <Link
                  href={`/hotels/${booking.propertyId}${bookAgainParams ? `?${bookAgainParams}` : ""}`}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  Book Again
                </Link>
                <button
                  onClick={() => setReviewTarget(booking)}
                  className="flex-1 py-2.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Write Review
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      {/* Modals */}
      {cancelTarget && (
        <CancelBookingDialog
          bookingRef={cancelTarget.bookingRef}
          onConfirm={(reason) => handleCancelConfirm(cancelTarget, reason)}
          onClose={() => setCancelTarget(null)}
        />
      )}
      {reviewTarget && accessToken && (
        <WriteReviewModal
          bookingId={reviewTarget.id}
          hotelName={propertiesById.get(reviewTarget.propertyId)?.name ?? "Hotel"}
          accessToken={accessToken}
          onClose={() => setReviewTarget(null)}
          onSuccess={() => setReviewTarget(null)}
        />
      )}

      <div className="h-1 bg-orange-600 w-full" />
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-sm text-gray-500 mt-0.5">{totalCount} total booking{totalCount !== 1 ? "s" : ""}</p>
          </div>
          <Link href="/hotels" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors">
            <Hotel className="w-4 h-4" /> Browse Hotels
          </Link>
        </div>

        {realError && <p className="text-xs text-red-500 font-medium mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{realError}</p>}

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm mb-6">
          {displayTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.id ? "bg-orange-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.id ? "bg-white/30 text-white" : "bg-gray-100 text-gray-600"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loadingReal ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <div key={i} className="h-44 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : hasReal ? (
          filteredReal.length === 0 ? (
            <div className="text-center py-20">
              <SearchX className="w-10 h-10 text-orange-400 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-800 mb-2">No {activeTab} bookings</h2>
              <Link href="/hotels" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm mt-4">
                <Hotel className="w-4 h-4" /> Browse Hotels
              </Link>
            </div>
          ) : (
            <div className="space-y-4">{filteredReal.map(renderRealBookingCard)}</div>
          )
        ) : (
          /* Mock booking cards for demo */
          filteredMock.length === 0 ? (
            <div className="text-center py-20">
              <SearchX className="w-10 h-10 text-orange-400 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-gray-800 mb-2">No {activeTab} bookings</h2>
              <Link href="/hotels" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm mt-4">
                <Hotel className="w-4 h-4" /> Browse Hotels
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMock.map((booking) => {
                const status = STATUS_CONFIG[booking.status];
                const StatusIcon = status.icon;
                return (
                  <div key={booking.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className={`px-5 py-2.5 flex items-center justify-between border-b ${status.bg}`}>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                        <span className={`text-xs font-bold ${status.color}`}>{status.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 tracking-widest">{booking.bookingRef}</span>
                    </div>
                    <div className="p-5 flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={booking.hotelImage} alt={booking.hotelName} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{booking.hotelName}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-orange-500 shrink-0" /> {booking.area}, {booking.city}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                          <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Check-in</p>
                            <p className="text-xs font-bold text-gray-700 flex items-center gap-1 mt-0.5"><CalendarDays className="w-3 h-3 text-orange-400" /> {fmt(booking.checkIn)}</p></div>
                          <div><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Check-out</p>
                            <p className="text-xs font-bold text-gray-700 flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3 text-orange-400" /> {fmt(booking.checkOut)}</p></div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {booking.rooms} room</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.guests} guests</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {booking.hours}h</span>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end justify-between">
                        <span className="text-lg font-black text-orange-600">₹{booking.totalPrice}</span>
                        <Link href={`/hotels/${booking.hotelId}`} className="p-2 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors">
                          <ChevronRight className="w-4 h-4 text-orange-500" />
                        </Link>
                      </div>
                    </div>
                    {booking.status === "confirmed" && (
                      <div className="px-5 pb-4 flex gap-2">
                        <Link href={`/booking-confirm/${booking.hotelId}?ref=${booking.bookingRef}&total=${booking.totalPrice}&date=${booking.checkIn.split("T")[0]}&hours=${booking.hours}&rooms=${booking.rooms}&guests=${booking.guests}&name=Guest`}
                          className="flex-1 py-2.5 text-center text-xs font-bold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors">
                          View Details
                        </Link>
                        <button className="flex-1 py-2.5 text-xs font-bold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                          Cancel Booking
                        </button>
                      </div>
                    )}
                    {booking.status === "completed" && (
                      <div className="px-5 pb-4 flex gap-2">
                        <Link href={`/hotels/${booking.hotelId}?hours=${booking.hours}&guests=${booking.guests}&rooms=${booking.rooms}`}
                          className="flex-1 py-2.5 text-center text-xs font-bold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors">
                          Book Again
                        </Link>
                        <button className="flex-1 py-2.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                          Write Review
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
