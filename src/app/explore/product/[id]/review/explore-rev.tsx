'use client';

import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { GetReviews } from "@/lib/get-reviews";
import PulseLoader from "@/components/pulse-loader";
import { SubmitReview } from "@/lib/submit-review";

type Props = {
  productId: string;
};

interface Review {
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
        className="w-full p-2 border rounded sec-ff border-gray-300 dark:border-gray-600 dark:bg-gray-800 mb-4"
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
        <ul className="space-y-3">
          {reviews.length === 0 ? (
            <li className="text-gray-500 sec-ff">No reviews yet.</li>
          ) : (
            reviews.map((review) => (
              <li key={review._id} className="border-b border-gray-200 dark:border-gray-700 pb-2 sec-ff">
                <p className="font-medium">
                  <span className="text-yellow-400">★</span> {review.rating}
                </p>
                <p>{review.comment}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}