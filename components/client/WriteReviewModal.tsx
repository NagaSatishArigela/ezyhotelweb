"use client";

import { useState } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { guestReviewsApi } from "@/lib/api";
import { useToast } from "@/components/client/Toast";

interface WriteReviewModalProps {
  bookingId: string;
  hotelName: string;
  accessToken: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WriteReviewModal({ bookingId, hotelName, accessToken, onClose, onSuccess }: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmit = async () => {
    if (rating === 0) { error("Please select a star rating"); return; }
    setSubmitting(true);
    try {
      await guestReviewsApi.submit(accessToken, { bookingId, rating, reviewText: text.trim() || undefined });
      success("Review submitted! Thank you for your feedback.");
      onSuccess();
    } catch {
      error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-orange-100 text-[10px] font-bold uppercase tracking-widest">Write a Review</p>
            <p className="text-white font-bold truncate max-w-[260px]">{hotelName}</p>
          </div>
          <button onClick={onClose} className="p-1 text-orange-100 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Star rating */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Your Rating *</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110"
                  aria-label={`${star} star`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hovered || rating) ? "fill-orange-400 text-orange-400" : "text-gray-200"
                    }`}
                  />
                </button>
              ))}
              {(hovered || rating) > 0 && (
                <span className="ml-2 text-sm font-bold text-orange-600">{RATING_LABELS[hovered || rating]}</span>
              )}
            </div>
          </div>

          {/* Review text */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Your Experience <span className="text-gray-400 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={1000}
              placeholder="Tell others about your stay — room quality, cleanliness, staff, value for money…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none bg-gray-50"
            />
            <p className="text-[11px] text-gray-400 text-right mt-1">{text.length}/1000</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : "Submit Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
