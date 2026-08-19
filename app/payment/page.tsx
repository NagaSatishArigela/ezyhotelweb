"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { ApiError, Booking, bookingsApi } from "@/lib/api";
import { useAppSelector } from "@/store/hooks";
import { selectAccessToken } from "@/store/selectors/authSelectors";

export default function PaymentPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] animate-pulse" />}><PaymentPageInner /></Suspense>;
}

function PaymentPageInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const bookingId = sp.get("bookingId");
  const accessToken = useAppSelector(selectAccessToken);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  async function handlePay() {
    if (!booking || !accessToken) return;
    setPaying(true);
    setPayError(null);
    try {
      // Layer C sandbox flow: create a gateway order, obtain a signed payment
      // from the sandbox checkout, then verify server-side (captures + confirms).
      const order = await bookingsApi.createPaymentOrder(accessToken, booking.id);
      const { paymentId, signature } = await bookingsApi.simulatePayment(accessToken, booking.id, order.orderId);
      await bookingsApi.verifyPayment(accessToken, booking.id, { orderId: order.orderId, paymentId, signature });
      router.push(`/booking-confirm/${booking.id}`);
    } catch (e) {
      setPayError(e instanceof ApiError ? e.message : "Payment could not be completed. Please try again.");
      setPaying(false);
    }
  }

  useEffect(() => {
    if (!bookingId || !accessToken) {
      setLoading(false);
      return;
    }
    bookingsApi
      .get(accessToken, bookingId)
      .then((b) => setBooking(b))
      .catch((e) => setError(e instanceof ApiError ? e.message : "Failed to load booking."))
      .finally(() => setLoading(false));
  }, [bookingId, accessToken]);

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No booking specified.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-[#F8F9FA] animate-pulse" />;
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">{error ?? "Booking not found."}</p>
      </div>
    );
  }

  const totalRupees = Math.round(booking.totalAmountPaise / 100);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 bg-orange-600 w-full" />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <ShieldCheck className="w-3.5 h-3.5" /> Secured by SSL
          </div>
        </div>

        <div className="bg-orange-500 rounded-2xl p-5 text-white mb-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Total Amount</p>
            <p className="text-3xl font-black tracking-tighter mt-1">₹{totalRupees}</p>
            <p className="text-xs opacity-70 mt-1">Ref: {booking.bookingRef}</p>
          </div>
          <ShieldCheck className="w-10 h-10 opacity-30" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Sandbox payment</h2>
          <p className="text-sm text-gray-500 mb-6">
            This is a demo checkout — no real money is charged. Paying runs the full gateway flow
            (order → signature verification → capture) and confirms your booking.
          </p>

          {payError && (
            <p className="text-sm text-red-600 mb-4">{payError}</p>
          )}

          <button
            onClick={handlePay}
            disabled={paying}
            className="inline-flex w-full items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors text-sm"
          >
            {paying ? "Processing…" : `Pay ₹${totalRupees}`}
          </button>

          <Link
            href={`/booking-confirm/${bookingId}`}
            className="mt-4 inline-flex items-center justify-center text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Pay later at the property
          </Link>
        </div>
      </div>
    </div>
  );
}
