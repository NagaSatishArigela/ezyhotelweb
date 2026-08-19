"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, ChevronRight, Clock, ShieldCheck, Users } from "lucide-react";
import {
  ApiError,
  BookingType,
  PublicPropertyDetail,
  bookingsApi,
  publicPropertiesApi,
} from "@/lib/api";
import { to24Hour } from "@/lib/time";
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken, selectIsAuthenticated } from "@/store/selectors/authSelectors";

const ROOM_TYPE_LABELS: Record<string, string> = {
  ac: "AC Room",
  nonac: "Non-AC Room",
  dorm: "Dorm",
  suite: "Suite",
};

export default function RealBookingView({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const accessToken = useAppSelector(selectAccessToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [property, setProperty] = useState<PublicPropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roomTypeId = sp.get("roomTypeId") ?? "";
  const bookingType = (sp.get("bookingType") as BookingType) || "hourly";
  const date = sp.get("date") ?? new Date().toISOString().split("T")[0];
  const time = sp.get("time") ?? "12:00 PM";
  const hours = Number(sp.get("hours") ?? 3);
  const guests = Number(sp.get("guests") ?? 2);

  useEffect(() => {
    let cancelled = false;
    publicPropertiesApi
      .getById(propertyId)
      .then((p) => { if (!cancelled) setProperty(p); })
      .catch((e) => { if (!cancelled) setError(e instanceof ApiError ? e.message : "Failed to load property."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [propertyId]);

  useEffect(() => {
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(`${pathname}?${sp.toString()}`);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [isAuthenticated, router, pathname, sp]);

  if (!isAuthenticated) return null;

  if (loading) {
    return <div className="min-h-screen bg-[#F8F9FA] animate-pulse" />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{error ?? "Property not found."}</p>
      </div>
    );
  }

  const roomType = property.roomTypes.find((r) => r.id === roomTypeId);
  if (!roomType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Selected room type is no longer available.</p>
      </div>
    );
  }

  const ratePaise = bookingType === "fullday" ? roomType.fulldayRatePaise : roomType.hourlyRatePaise;
  const baseTotal = bookingType === "hourly"
    ? Math.round(((ratePaise ?? 0) / 100) * hours)
    : Math.round((ratePaise ?? 0) / 100);
  const taxAmount = Math.round(baseTotal * 0.18);
  const finalTotal = baseTotal + taxAmount;

  const time24 = to24Hour(time);
  // Parse WITHOUT a trailing "Z" so the selected wall-clock time is interpreted
  // in the guest's local timezone; toISOString() then serialises the correct
  // UTC instant for the backend. Stamping it as UTC (…Z) shifted every booking
  // by the local offset (e.g. −5:30 in IST).
  const checkIn = new Date(`${date}T${time24}:00`);
  const durationHours = bookingType === "hourly" ? hours : 24;
  const checkOut = new Date(checkIn.getTime() + durationHours * 3600000);
  const fmt = (d: Date) => d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "2-digit", hour: "numeric", minute: "2-digit", hour12: true });

  const handleProceed = async () => {
    if (!guestName || !guestPhone || !accessToken) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const booking = await bookingsApi.create(accessToken, {
        propertyId,
        roomTypeId: roomType.id,
        bookingType,
        checkInAt: checkIn.toISOString(),
        durationHours: bookingType === "hourly" ? hours : undefined,
        // Backend must independently enforce room capacity limits.
        guestCount: guests,
        guestName,
        guestPhone,
        guestEmail: guestEmail || undefined,
        specialRequests: specialRequests || undefined,
      });
      router.push(`/payment?bookingId=${booking.id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 bg-orange-600 w-full" />
      <div className="max-w-5xl mx-auto px-4 py-6">

        <Link href={`/hotels/${propertyId}`} className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to property
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
              {property.primaryImageUrl && (
                <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0">
                  <Image src={property.primaryImageUrl} alt={property.name} fill className="object-cover" sizes="96px" />
                </div>
              )}
              <div className="space-y-1">
                <h2 className="font-bold text-gray-900">{property.name}</h2>
                <p className="text-xs text-gray-500">{[property.area, property.city].filter(Boolean).join(", ")}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs font-medium text-gray-600">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-orange-500" /> {fmt(checkIn)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-500" /> {fmt(checkOut)}</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span>{ROOM_TYPE_LABELS[roomType.type] ?? roomType.type}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {guests} guest{guests > 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bookingType === "hourly" ? `${hours} hours` : "Full day"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-bold text-gray-900">Guest Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Full Name *</label>
                  <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="As per ID proof" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors bg-gray-50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Phone Number *</label>
                  <input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors bg-gray-50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Email Address</label>
                  <input value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="For booking confirmation" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors bg-gray-50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Special Requests</label>
                  <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={2} placeholder="Early check-in, extra pillows, etc." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors bg-gray-50 resize-none" />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold text-gray-800">Cancellation Policy</p>
                <p>Free cancellation up to 1 hour before check-in. No refund after that.</p>
                <p>Valid government ID required at check-in for all guests.</p>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-4">
                <p className="text-white text-xs font-bold uppercase tracking-widest">Price Breakdown</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>{bookingType === "hourly" ? `Room rate (${hours}h)` : "Room rate (full day)"}</span>
                    <span className="font-bold text-gray-900">₹{baseTotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & fees (18%)</span>
                    <span className="font-bold text-gray-900">₹{taxAmount}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-orange-600">₹{finalTotal}</span>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!guestName || !guestPhone || isSubmitting}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  {isSubmitting ? "Processing…" : "Proceed to Pay"}
                </button>

                <p className="text-center text-[10px] text-gray-400 font-medium">
                  Secured by 256-bit SSL encryption
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
