'use client';

import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { GetReviews } from "@/lib/get-reviews";
import PulseLoader from "@/components/pulse-loader";
import { SubmitReview } from "@/lib/submit-review";
import Image from "next/image";

type Props = {
  productId: string;
};

interface Review {
  reviewerPhoto: string | null;
  reviewerName: string;
  _id: string;
  productId: string;
  orderId?: string;
  buyerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ExploreReview({ productId }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [reviews, setReviews] = useState<Review[]>([]); // proper typing

  // fetch reviews on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await GetReviews(productId);
        setReviews(data);
      } catch (err) {
        console.log((err as Error).message);
      }
    })();
  }, [productId]);

  // submit review
  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) return toast.error('Rating must be 1–5');

    setLoading(true);
    try {
      await SubmitReview(productId, rating, comment);
      setRating(0);
      setComment('');

      // refresh reviews list
      const updatedReviews = await GetReviews(productId);
      setReviews(updatedReviews);
    } catch (err) {
      console.log((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[var(--bg-clr)] p-6 rounded-xl shadow border border-gray-200 dark:border-gray-700 mt-4">
      <h2 className="text-xl font-bold mb-4 pry-ff text-[var(--acc-clr)]">Write a Review</h2>

      {/* Rating stars */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Review input */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        className="w-full p-2 border rounded sec-ff border-gray-300 dark:border-gray-600 dark:bg-gray-800 mb-4 text-[var(--pry-clr)]"
        rows={4}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 bg-[var(--acc-clr)] text-[var(--bg-clr)] rounded sec-ff font-semibold cursor-pointer disabled:opacity-50"
      >
        {loading ? <PulseLoader /> : 'Submit Review'}
      </button>

      {/* Show reviews */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 sec-ff">Customer Reviews</h3>
        <ul className="space-y-4">
          {reviews.length === 0 ? (
            <li className="text-gray-500 dark:text-gray-400 sec-ff">No reviews yet.</li>
          ) : (
            reviews.map((review) => (
              <li
                key={review._id}
                className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 text-[var(--bg-clr)]"
              >
              {/* Reviewer photo */}
              {review.reviewerPhoto ? (
                <Image
                  width={50}
                  height={50}
                  src={review.reviewerPhoto}
                  alt={review.reviewerName || 'Anonymous'}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-[var(--prof-clr)]">
                  {review.reviewerName?.[0] || 'A'}
                </div>
              )}

              <div className="flex-1">
          {/* Name + rating */}
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-gray-800 dark:text-gray-100 pry-ff font-semibold text-[var(--bg-clr)]">
              {review.reviewerName || 'Anonymous'}
            </p>
            <span className="text-yellow-400 font-medium sec-ff">
              ★ {review.rating}
            </span>
          </div>
          {/* Comment */}
          <p className="dark:text-gray-300 sec-ff text-[var(--bg-clr)]">
            {review.comment}
          </p>
          {/* Optional date */}
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1m sec-ff">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      </li>
    ))
  )}
</ul>


      </div>
    </div>
  );
}