"use client";

import { useState } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

const CANCEL_REASONS = [
  "Change of plans",
  "Found a better option",
  "Emergency / personal reasons",
  "Incorrect booking details",
  "Hotel did not meet expectations",
  "Other",
];

interface CancelBookingDialogProps {
  bookingRef: string;
  onConfirm: (reason: string) => Promise<void>;
  onClose: () => void;
}

export default function CancelBookingDialog({ bookingRef, onConfirm, onClose }: CancelBookingDialogProps) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const finalReason = reason === "Other" ? customReason.trim() : reason;

  const handleConfirm = async () => {
    if (!finalReason) return;
    setCancelling(true);
    try { await onConfirm(finalReason); }
    finally { setCancelling(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Cancel Booking?</h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{bookingRef}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-5 text-xs text-gray-600">
            <p className="font-bold text-gray-800 mb-0.5">Cancellation Policy</p>
            <p>Free cancellation up to 1 hour before check-in. No refund after that.</p>
          </div>

          {/* Reason selection */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reason for cancellation *</p>
            {CANCEL_REASONS.map((r) => (
              <label key={r} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="cancel-reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-orange-500 w-4 h-4"
                />
                <span className="text-sm text-gray-700">{r}</span>
              </label>
            ))}
          </div>

          {reason === "Other" && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="Please describe your reason…"
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none bg-gray-50 mb-4"
            />
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Keep Booking
            </button>
            <button
              onClick={handleConfirm}
              disabled={!finalReason || cancelling}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {cancelling ? <><Loader2 className="w-4 h-4 animate-spin" /> Cancelling…</> : "Confirm Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
