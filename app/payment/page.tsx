"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, ShieldCheck, Lock, CheckCircle } from "lucide-react";

type PaymentMethod = "card" | "upi" | "netbanking" | "wallet";

const UPI_APPS = [
  { name: "Google Pay", icon: "🟢", id: "gpay" },
  { name: "PhonePe", id: "phonepe", icon: "🟣" },
  { name: "Paytm", id: "paytm", icon: "🔵" },
  { name: "Other UPI", id: "other", icon: "📲" },
];

const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Yes Bank", "Punjab National Bank"];

const WALLETS = [
  { name: "Paytm Wallet", icon: "💳" },
  { name: "Amazon Pay", icon: "🟠" },
  { name: "Mobikwik", icon: "🔷" },
];

export default function PaymentPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#F8F9FA] animate-pulse" />}><PaymentPageInner /></Suspense>;
}

function PaymentPageInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const total = Number(sp.get("total") ?? 0);
  const hotelId = sp.get("hotelId");
  const name = sp.get("name") ?? "";

  const [method, setMethod] = useState<PaymentMethod>("upi");
  const [selectedUpi, setSelectedUpi] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate payment processing steps
    const steps = [
      "Verifying payment details…",
      "Connecting to payment gateway…",
      "Processing transaction…",
      "Confirming booking…",
    ];
    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }
    const bookingRef = `PPH${Date.now().toString().slice(-8).toUpperCase()}`;
    const params = new URLSearchParams({
      ...Object.fromEntries(sp.entries()),
      ref: bookingRef,
    });
    router.push(`/booking-confirm/${hotelId}?${params.toString()}`);
  };

  const processingSteps = ["Verifying details", "Payment gateway", "Processing", "Confirming booking"];

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl p-10 shadow-xl max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Lock className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-sm text-gray-500 mb-8">Please do not close this window</p>
          <div className="space-y-3">
            {processingSteps.map((step, i) => (
              <div key={step} className={`flex items-center gap-3 text-sm ${i <= processingStep ? "text-green-600" : "text-gray-300"}`}>
                {i < processingStep ? (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                ) : i === processingStep ? (
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-200 shrink-0" />
                )}
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-16">
      <div className="h-1 bg-orange-600 w-full" />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link href={`/booking/${hotelId}`} className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to booking details
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <ShieldCheck className="w-3.5 h-3.5" /> Secured by SSL
          </div>
        </div>

        {/* Amount due */}
        <div className="bg-orange-500 rounded-2xl p-5 text-white mb-6 flex justify-between items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Total Amount</p>
            <p className="text-3xl font-black tracking-tighter mt-1">₹{total}</p>
            {name && <p className="text-xs opacity-70 mt-1">for {name}</p>}
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
        </div>

        {/* Method tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
          <div className="grid grid-cols-4 border-b border-gray-100">
            {([
              { id: "upi" as PaymentMethod, icon: Smartphone, label: "UPI" },
              { id: "card" as PaymentMethod, icon: CreditCard, label: "Card" },
              { id: "netbanking" as PaymentMethod, icon: Building2, label: "Net Banking" },
              { id: "wallet" as PaymentMethod, icon: Wallet, label: "Wallet" },
            ]).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={`py-4 flex flex-col items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${method === id ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-5">
            {method === "upi" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setSelectedUpi(app.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${selectedUpi === app.id ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-orange-200"}`}
                    >
                      <span className="text-xl">{app.icon}</span>
                      <span className="text-sm font-bold text-gray-800">{app.name}</span>
                    </button>
                  ))}
                </div>
                {selectedUpi === "other" && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">UPI ID</label>
                    <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@upi" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-gray-50" />
                  </div>
                )}
              </div>
            )}

            {method === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Card Number</label>
                  <input value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim())} placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-gray-50 font-mono tracking-widest" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Cardholder Name</label>
                  <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="As printed on card" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-gray-50" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">Expiry</label>
                    <input value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} placeholder="MM / YY" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-gray-50" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">CVV</label>
                    <input value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="•••" type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-gray-50" />
                  </div>
                </div>
              </div>
            )}

            {method === "netbanking" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Select Your Bank</label>
                <div className="grid grid-cols-1 gap-2">
                  {BANKS.map((bank) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedBank(bank)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${selectedBank === bank ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-100 hover:border-orange-200 text-gray-700"}`}
                    >
                      {bank}
                      {selectedBank === bank && <CheckCircle className="w-4 h-4 text-orange-500" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {method === "wallet" && (
              <div className="grid grid-cols-1 gap-3">
                {WALLETS.map((w) => (
                  <button key={w.name} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all text-sm font-bold text-gray-800">
                    <span className="text-2xl">{w.icon}</span> {w.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handlePay}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" /> Pay ₹{total} Securely
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          This is a mock payment — no real transaction will occur.
        </p>
      </div>
    </div>
  );
}
