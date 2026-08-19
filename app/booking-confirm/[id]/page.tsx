"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import QRCode from "react-qr-code";
import {
  CheckCircle, Download, Share2, CalendarDays, Clock,
  MapPin, BedDouble, Users, Phone, Home, CalendarCheck, Navigation,
} from "lucide-react";
import { hotelsData } from "@/data/hotelsData";
import RealBookingConfirm from "./RealBookingConfirm";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function generateICS(params: { title: string; location: string; start: Date; end: Date; description: string }): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//EzyHotels//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@ezyhotels.com`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(params.start)}`,
    `DTEND:${fmt(params.end)}`,
    `SUMMARY:${params.title}`,
    `LOCATION:${params.location}`,
    `DESCRIPTION:${params.description}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export default function BookingConfirmPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] animate-pulse" />}><BookingConfirmInner /></Suspense>;
}

function BookingConfirmInner() {
  const { id } = useParams<{ id: string }>();
  const sp = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => { setTimeout(() => setShow(true), 100); }, []);

  if (UUID_RE.test(id)) {
    return <RealBookingConfirm bookingId={id} />;
  }

  // Demo (numeric-id) confirmation is dev-only; never render it in production.
  if (process.env.NODE_ENV === "production") notFound();

  const hotel = hotelsData.find((h) => h.id === Number(id));
  const stableRef = useMemo(() => `EZY${Math.random().toString(36).slice(2, 10).toUpperCase()}`, []);
  const bookingRef = sp.get("ref") ?? stableRef;
  const total = sp.get("total") ?? "0";
  const date = sp.get("date") ?? "";
  const time = sp.get("time") ?? "12:00 PM";
  const hours = Number(sp.get("hours") ?? 3);
  const rooms = Number(sp.get("rooms") ?? 1);
  const guests = Number(sp.get("guests") ?? 2);
  const guestName = sp.get("name") ?? "Guest";

  const checkIn = date ? new Date(`${date}T12:00:00`) : new Date();
  const checkOut = new Date(checkIn.getTime() + hours * 3600000);
  const fmt = (d: Date) =>
    d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "2-digit", hour: "numeric", minute: "2-digit", hour12: true });

  const handleDownload = () => window.print();

  const handleShare = async () => {
    const text = `My booking at ${hotel?.name ?? "Hotel"} is confirmed!\nRef: ${bookingRef}\nCheck-in: ${fmt(checkIn)}\nCheck-out: ${fmt(checkOut)}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Booking Confirmed — EzyHotels.com", text }); } catch { /* user dismissed */ }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Booking details copied to clipboard!");
    }
  };

  const handleAddToCalendar = () => {
    const ics = generateICS({
      title: `Stay at ${hotel?.name ?? "Hotel"} — EzyHotels.com`,
      location: hotel ? `${hotel.area}, ${hotel.city}` : "",
      start: checkIn,
      end: checkOut,
      description: `Booking Ref: ${bookingRef}. Total paid: ₹${total}. Show this QR at check-in.`,
    });
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${bookingRef}.ics`; a.click();
    URL.revokeObjectURL(url);
  };

  const directionsUrl = hotel
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${hotel.name} ${hotel.area} ${hotel.city}`)}`
    : null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 bg-green-500 w-full" />
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Success header */}
        <div className={`text-center mb-8 transition-all duration-500 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm">Your stay has been successfully booked. Have a great time!</p>
        </div>

        {/* Booking card */}
        <div className={`bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-5 transition-all duration-500 delay-100 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

          {/* Ref banner */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center">
            <div>
              <p className="text-green-100 text-[10px] font-bold uppercase tracking-widest">Booking Reference</p>
              <p className="text-white text-xl font-black tracking-widest">{bookingRef}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>

          {/* Hotel info */}
          {hotel && (
            <div className="p-5 flex gap-4 border-b border-gray-100">
              <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={hotel.image} alt={hotel.name} fill className="object-cover" sizes="80px" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{hotel.name}</h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-orange-500" /> {hotel.area}, {hotel.city}
                </p>
                <a href="tel:+919492691010" className="text-xs text-orange-600 font-bold flex items-center gap-1 mt-1 hover:underline">
                  <Phone className="w-3 h-3" /> +91 94926 91010
                </a>
              </div>
            </div>
          )}

          {/* Stay details */}
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
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Duration</p>
              <p className="text-sm font-bold text-gray-900">{hours} hour{hours > 1 ? "s" : ""}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Guests</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-blue-400" /> {rooms} room · <Users className="w-4 h-4 text-purple-400" /> {guests} guest{guests > 1 ? "s" : ""}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Guest Name</p>
              <p className="text-sm font-bold text-gray-900">{guestName}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
              <p className="text-sm font-black text-green-600">₹{total}</p>
            </div>
          </div>

          {/* QR code — real scannable code */}
          <div className="p-5 flex flex-col items-center gap-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Show this at check-in</p>
            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
              <QRCode
                value={`EZY:${bookingRef}:${hotel?.id ?? id}:${date}:${hours}`}
                size={128}
                level="M"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-medium">{bookingRef}</p>
          </div>
        </div>

        {/* Policies reminder */}
        <div className={`bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5 text-xs text-gray-600 space-y-1 transition-all duration-500 delay-200 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="font-bold text-gray-800">What to bring</p>
          <p>• Valid Government ID (Aadhar / Passport / Driving License)</p>
          <p>• Show QR code or booking reference at front desk</p>
          <p>• Arrive within 30 mins of check-in time to hold room</p>
        </div>

        {/* Actions */}
        <div className={`grid grid-cols-2 gap-3 transition-all duration-500 delay-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 border border-orange-200 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4" /> Download
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 border border-orange-200 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handleAddToCalendar}
            className="flex items-center justify-center gap-2 py-3 border border-orange-200 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-sm"
          >
            <CalendarCheck className="w-4 h-4" /> Add to Calendar
          </button>
          {directionsUrl ? (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 border border-orange-200 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors text-sm"
            >
              <Navigation className="w-4 h-4" /> Get Directions
            </a>
          ) : (
            <Link href="/" className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">
              <Home className="w-4 h-4" /> Home
            </Link>
          )}
          <Link href="/my-bookings" className="col-span-2 flex items-center justify-center gap-2 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors text-sm">
            <CalendarCheck className="w-4 h-4" /> View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
