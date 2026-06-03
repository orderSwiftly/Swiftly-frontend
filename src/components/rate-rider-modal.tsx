// src/components/rate-rider-modal.tsx

"use client";

import { useState } from "react";
import { X, Star, Flag, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { rateRider, reportRider } from "@/lib/orders-api";
import toast from "react-hot-toast";

interface RateRiderModalProps {
  orderId: string;
  onClose: () => void;
  onDone: () => void;
}

const STAR_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Great",
  5: "Excellent",
};

export default function RateRiderModal({
  orderId,
  onClose,
  onDone,
}: RateRiderModalProps) {
  // ── Rating state ──────────────────────────────────────────────────────────
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  // ── Report state ──────────────────────────────────────────────────────────
  const [showReport, setShowReport] = useState(false);
  const [reason, setReason] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // ── Loading ───────────────────────────────────────────────────────────────
  const [submittingRating, setSubmittingRating] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);

  const displayStar = hovered || rating;

  // ── Submit rating (+optional review) ─────────────────────────────────────
  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmittingRating(true);
    try {
      await rateRider(orderId, {
        rating,
        ...(review.trim() ? { review: review.trim() } : {}),
      });
      toast.success("Thanks for your rating!");
      onDone();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  // ── Submit report ─────────────────────────────────────────────────────────
  const handleSubmitReport = async () => {
    if (reason.trim().length < 10) {
      toast.error("Please provide at least 10 characters for the reason");
      return;
    }
    if (reason.trim().length > 500) {
      toast.error("Reason must not exceed 500 characters");
      return;
    }

    setSubmittingReport(true);
    try {
      await reportRider(orderId, { reason: reason.trim() });
      toast.success("Report submitted. We'll look into it.");
      setReportSubmitted(true);
      setShowReport(false);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 sec-ff ">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#f0f0f0]">
          <div>
            <h3 className="text-lg font-bold text-[#0A0F1A] sec-ff">Rate Your Delivery</h3>
            <p className="text-xs text-[#c0c0c0] mt-0.5">How was your delivery experience?</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#f5f5f5] hover:bg-[#ebebeb] text-[#888] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Stars */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    size={36}
                    className={`transition-colors duration-150 ${
                      star <= displayStar
                        ? "fill-[#f5a623] text-[#f5a623]"
                        : "fill-[#f0f0f0] text-[#e0e0e0]"
                    }`}
                  />
                </button>
              ))}
            </div>
            {displayStar > 0 && (
              <span className="text-sm font-semibold text-[#669917] animate-in fade-in duration-150">
                {STAR_LABELS[displayStar]}
              </span>
            )}
          </div>

          {/* Review */}
          <div>
            <label className="block text-xs font-semibold text-[#888] uppercase tracking-wide mb-1.5">
              Review <span className="font-normal normal-case text-[#c0c0c0]">(optional)</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => {
                if (e.target.value.length <= 500) setReview(e.target.value);
              }}
              placeholder="Tell us about your experience…"
              rows={3}
              className="w-full px-3 py-2.5 text-sm text-[#0A0F1A] border border-[#e8e8e8] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#8acc2a] focus:border-transparent placeholder:text-[#d0d0d0]"
            />
            <p className="text-right text-[10px] text-[#c0c0c0] mt-1">
              {review.length}/500
            </p>
          </div>

          {/* Report toggle */}
          {!reportSubmitted ? (
            <div>
              <button
                onClick={() => setShowReport((v) => !v)}
                className="flex items-center gap-1.5 text-xs text-[#e05252] hover:text-[#c03c3c] transition-colors font-medium"
              >
                <Flag size={13} />
                Report a problem
                {showReport ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {showReport && (
                <div className="mt-3 p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <p className="text-xs text-red-700">
                    Describe what went wrong. We&apos;ll review and take action if needed.
                  </p>
                  <textarea
                    value={reason}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) setReason(e.target.value);
                    }}
                    placeholder="Describe the issue (min. 10 characters)…"
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm text-[#0A0F1A] border border-red-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent placeholder:text-[#d0b0b0] bg-white"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-red-400">{reason.length}/500</p>
                    <button
                      onClick={handleSubmitReport}
                      disabled={submittingReport || reason.trim().length < 10}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      {submittingReport ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Flag size={13} />
                      )}
                      Submit Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#888] flex items-center gap-1.5">
              <Flag size={12} className="text-green-500" />
              Report submitted — thank you for letting us know.
            </p>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="flex gap-3 px-6 pb-6 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm text-[#888] bg-[#f5f5f5] hover:bg-[#ebebeb] rounded-xl font-medium transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleSubmitRating}
            disabled={submittingRating || rating === 0}
            className="flex-1 px-4 py-2.5 text-sm bg-[var(--bg-clr)] hover:bg-[#8acc2a] disabled:opacity-50 text-[var(--txt-clr)] rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {submittingRating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Submit Rating"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}