"use client";

import { Suspense, useState } from "react";
import { useParams, useRouter, useSearchParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, BedDouble, Users, CalendarDays, ChevronRight, ShieldCheck, Tag, CreditCard } from "lucide-react";
import { hotelsData } from "@/data/hotelsData";
import RealBookingView from "./RealBookingView";

// Promo codes are validated server-side via /api/promos/[code] — never stored client-side
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();

  if (UUID_RE.test(id)) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] animate-pulse" />}>
        <RealBookingView propertyId={id} />
      </Suspense>
    );
  }

  // Demo (numeric-id) booking flow is dev-only; never expose it in production.
  if (process.env.NODE_ENV === "production") notFound();

  return <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] animate-pulse" />}><BookingPageInner /></Suspense>;
}

function BookingPageInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const sp = useSearchParams();

  const hotel = hotelsData.find((h) => h.id === Number(id));

  const date = sp.get("date") ?? new Date().toISOString().split("T")[0];
  const time = sp.get("time") ?? "12:00 PM";
  const hours = Number(sp.get("hours") ?? 3);
  const rooms = Number(sp.get("rooms") ?? 1);
  const guests = Number(sp.get("guests") ?? 2);
  const baseTotal = Number(sp.get("price") ?? 0);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoValidating, setPromoValidating] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [idType, setIdType] = useState("aadhar");
  const [specialRequests, setSpecialRequests] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discount = appliedPromo ? Math.round(baseTotal * (appliedDiscount / 100)) : 0;
  const finalTotal = baseTotal - discount;

  const applyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    setPromoValidating(true);
    setPromoError("");
    try {
      const res = await fetch(`/api/promos/${encodeURIComponent(code)}`);
      const data = await res.json() as { valid: boolean; discount?: number; message?: string };
      if (data.valid && data.discount != null) {
        setAppliedPromo(code);
        setAppliedDiscount(data.discount);
      } else {
        setPromoError(data.message ?? "Invalid promo code.");
        setAppliedPromo(null);
        setAppliedDiscount(0);
      }
    } catch {
      setPromoError("Could not validate promo code. Please try again.");
    } finally {
      setPromoValidating(false);
    }
  };

  const handleProceed = async () => {
    if (!guestName || !guestPhone) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    const params = new URLSearchParams({
      hotelId: String(hotel?.id ?? id),
      date, time,
      hours: String(hours),
      rooms: String(rooms),
      guests: String(guests),
      total: String(finalTotal),
      name: guestName,
      phone: guestPhone,
    });
    router.push(`/payment?${params.toString()}`);
  };

  if (!hotel) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Hotel not found.</p>
    </div>
  );

  const checkIn = new Date(`${date}T12:00:00`);
  const checkOut = new Date(checkIn.getTime() + hours * 3600000);
  const fmt = (d: Date) => d.toLocaleString("en-IN", { day: "numeric", month: "short", year: "2-digit", hour: "numeric", minute: "2-digit", hour12: true });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 bg-orange-600 w-full" />
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Back */}
        <Link href={`/hotels/${id}`} className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to hotel
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Guest details + Promo */}
          <div className="lg:col-span-2 space-y-5">

            {/* Stay summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
              <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0">
                <Image src={hotel.image} alt={hotel.name} fill className="object-cover" sizes="96px" />
              </div>
              <div className="space-y-1">
                <h2 className="font-bold text-gray-900">{hotel.name}</h2>
                <p className="text-xs text-gray-500">{hotel.area}, {hotel.city}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs font-medium text-gray-600">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-orange-500" /> {fmt(checkIn)}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-orange-500" /> {fmt(checkOut)}</span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {rooms} room{rooms > 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {guests} guest{guests > 1 ? "s" : ""}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {hours} hours</span>
                </div>
              </div>
            </div>

            {/* Guest details */}
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
                {/* ID type + T&C for compliance */}
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    <CreditCard className="inline w-3 h-3 mr-1" />ID Proof Type *
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors bg-gray-50"
                  >
                    <option value="aadhar">Aadhar Card</option>
                    <option value="passport">Passport</option>
                    <option value="driving_license">Driving License</option>
                    <option value="voter_id">Voter ID</option>
                    <option value="pan">PAN Card</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Special Requests</label>
                  <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={2} placeholder="Early check-in, extra pillows, etc." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors bg-gray-50 resize-none" />
                </div>

                {/* T&C consent */}
                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded accent-orange-500 shrink-0"
                    />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to the{" "}
                      <a href="/terms" className="text-orange-600 font-semibold hover:underline">Terms & Conditions</a>
                      {" "}and{" "}
                      <a href="/privacy" className="text-orange-600 font-semibold hover:underline">Privacy Policy</a>.
                      I confirm that I will present the selected ID proof at check-in.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Promo */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Tag className="w-4 h-4 text-orange-500" /> Promo Code</h3>
              <div className="flex gap-2">
                <input value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Enter code (e.g. EZY10)" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-gray-50 uppercase font-bold tracking-wider" />
                <button onClick={applyPromo} disabled={promoValidating} className="px-5 py-2.5 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-colors disabled:opacity-60">{promoValidating ? "…" : "Apply"}</button>
              </div>
              {promoError && <p className="text-xs text-red-500 font-medium">{promoError}</p>}
              {appliedPromo && <p className="text-xs text-green-600 font-bold">✓ {appliedPromo} applied — {appliedDiscount}% off!</p>}
            </div>

            {/* Policies */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold text-gray-800">Cancellation Policy</p>
                <p>Free cancellation up to 1 hour before check-in. No refund after that.</p>
                <p>Valid government ID required at check-in for all guests.</p>
              </div>
            </div>
          </div>

          {/* Right: Price summary + Pay button */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-5 py-4">
                <p className="text-white text-xs font-bold uppercase tracking-widest">Price Breakdown</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Room rate ({hours}h × {rooms} room{rooms > 1 ? "s" : ""})</span>
                    <span className="font-bold text-gray-900">₹{Math.round(baseTotal / 1.18)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>GST (18%)</span>
                    <span className="font-bold text-gray-900">₹{baseTotal - Math.round(baseTotal / 1.18)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo ({appliedPromo})</span>
                      <span className="font-bold">−₹{discount}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-orange-600">₹{finalTotal}</span>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!guestName || !guestPhone || !termsAccepted || isSubmitting}
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
