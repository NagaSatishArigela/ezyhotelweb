"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle, CalendarDays, Clock,
  MapPin, Users, Phone, Home, CalendarCheck,
} from "lucide-react";
import QRCode from "react-qr-code";
import { ApiError, Booking, PublicPropertyDetail, bookingsApi, publicPropertiesApi } from "@/lib/api";
// bookingsApi.checkIn / checkOut are staff operations — not exposed to guests here
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken } from "@/store/selectors/authSelectors";

const ROOM_TYPE_LABELS: Record<string, string> = {
  ac: "AC Room",
  nonac: "Non-AC Room",
  dorm: "Dorm",
  suite: "Suite",
};

export default function RealBookingConfirm({ bookingId }: { bookingId: string }) {
  const accessToken = useAppSelector(selectAccessToken);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [property, setProperty] = useState<PublicPropertyDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    bookingsApi
      .get(accessToken, bookingId)
      .then(async (b) => {
        if (cancelled) return;
        setBooking(b);
        const p = await publicPropertiesApi.getById(b.propertyId);
        if (!cancelled) setProperty(p);
      })
      .catch((e) => { if (!cancelled) setError(e instanceof ApiError ? e.message : "Failed to load booking."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [accessToken, bookingId]);

  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view this booking.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-[#F8F9FA] animate-pulse" />;
  }

  if (error || !booking || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{error ?? "Booking not found."}</p>
      </div>
    );
  }

  const checkIn = new Date(booking.checkInAt);
  const checkOut = new Date(booking.checkOutAt);
  const fmt = (d: Date) =>
    d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "2-digit", hour: "numeric", minute: "2-digit", hour12: true });
  const roomType = property.roomTypes.find((r) => r.id === booking.roomTypeId);
  const totalRupees = Math.round(booking.totalAmountPaise / 100);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 bg-green-500 w-full" />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className={`text-center mb-8 transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm">Your stay has been successfully booked. Have a great time!</p>
        </div>

        <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-5 transition-all duration-500 delay-100 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest">Booking Reference</p>
              <p className="text-white text-xl font-black tracking-widest">{booking.bookingRef}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>

          <div className="p-5 flex gap-4 border-b border-gray-100">
            {property.primaryImageUrl && (
              <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={property.primaryImageUrl} alt={property.name} fill className="object-cover" sizes="80px" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-gray-900">{property.name}</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-orange-500" /> {[property.area, property.city].filter(Boolean).join(", ")}
              </p>
              <a href="tel:+919492691010" className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1 hover:underline">
                <Phone className="w-3 h-3" /> +91 94926 91010
              </a>
            </div>
          </div>

          <div className="p-5 grid grid-cols-2 gap-4 border-b border-gray-100">
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-in</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-green-500" /> {fmt(checkIn)}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-out</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" /> {fmt(checkOut)}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Room</p>
              <p className="text-sm font-bold text-gray-900">{roomType ? (ROOM_TYPE_LABELS[roomType.type] ?? roomType.type) : "—"}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Guests</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-purple-400" /> {booking.guestCount} guest{booking.guestCount > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-bold text-gray-900 capitalize">{booking.status.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
              <p className="text-sm font-black text-green-600">₹{totalRupees}</p>
            </div>
          </div>

          <div className="p-5 flex flex-col items-center gap-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Show this at check-in</p>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
              <QRCode value={booking.qrCode ?? `EZY:${booking.bookingRef}:${booking.propertyId}`} size={128} level="M" />
            </div>
            <p className="text-[10px] text-gray-400 font-medium">{booking.bookingRef}</p>
          </div>
        </div>

        <div className={`bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5 text-xs text-gray-600 space-y-1 transition-all duration-500 delay-200 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="font-bold text-gray-800">What to bring</p>
          <p>• Valid Government ID (Aadhar / Passport / Driving License)</p>
          <p>• Show QR code or booking reference at front desk</p>
          <p>• Arrive within 30 mins of check-in time to hold room</p>
        </div>

        {/* Status badge — check-in/check-out is a staff operation at the front desk */}
        {(booking.status === "confirmed" || booking.status === "checked_in") && (
          <div className={`mb-3 transition-all duration-500 delay-250 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border ${booking.status === "checked_in" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-green-50 border-green-200 text-green-700"}`}>
              <CheckCircle className="w-4 h-4" />
              {booking.status === "checked_in" ? "Checked in — enjoy your stay!" : "Show QR code at front desk to check in"}
            </div>
          </div>
        )}

        <div className={`grid grid-cols-2 gap-3 transition-all duration-500 delay-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Link href="/my-bookings" className="col-span-2 flex items-center justify-center gap-2 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm">
            <CalendarCheck className="w-4 h-4" /> My Bookings
          </Link>
          <Link href="/" className="col-span-2 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
            <Home className="w-4 h-4" /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
