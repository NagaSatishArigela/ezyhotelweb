"use client";

import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { guestReviewsApi, type GuestReview, type PropertyRatingSummary } from "@/lib/api";

interface PropertyReviewsProps {
  propertyId: string;
}

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<GuestReview[]>([]);
  const [summary, setSummary] = useState<PropertyRatingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 5;

  useEffect(() => {
    let aborted = false;
    Promise.all([
      guestReviewsApi.listForProperty(propertyId, page, LIMIT),
      page === 1 ? guestReviewsApi.summary(propertyId) : Promise.resolve(null),
    ])
      .then(([res, sum]) => {
        if (aborted) return;
        setReviews((prev) => page === 1 ? res.items : [...prev, ...res.items]);
        setTotal(res.total);
        if (sum) setSummary(sum);
      })
      .catch(() => { /* silently degrade — reviews are non-critical */ })
      .finally(() => { if (!aborted) setLoading(false); });
    return () => { aborted = true; };
  }, [propertyId, page]);

  if (loading && page === 1) {
    return (
      <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Guest Reviews</h2>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading reviews…
        </div>
      </div>
    );
  }

  if (!loading && reviews.length === 0) {
    return (
      <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Reviews</h2>
        <p className="text-sm text-gray-400">No reviews yet. Be the first to review this property!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 lg:p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Guest Reviews</h2>
        {summary && summary.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 text-white px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-bold">
              <Star className="w-3.5 h-3.5 fill-white" />
              {summary.averageRating?.toFixed(1) ?? "—"}
            </div>
            <span className="text-xs text-gray-400">{summary.totalReviews} review{summary.totalReviews !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600 text-sm shrink-0">
                  {(review.guest?.name ?? "G")[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{review.guest?.name ?? "Verified Guest"}</h4>
                  <p className="text-xs text-gray-400 font-medium">
                    {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded text-[10px] font-bold shrink-0">
                {review.rating} <Star className="w-3 h-3 fill-current" />
              </div>
            </div>
            {review.reviewText && (
              <p className="text-sm text-gray-600 leading-relaxed pl-[52px]">{review.reviewText}</p>
            )}
          </div>
        ))}
      </div>

      {reviews.length < total && (
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
          className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Load more reviews ({total - reviews.length} remaining)
        </button>
      )}
    </div>
  );
}
