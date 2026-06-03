'use client';

import Link from 'next/link';
import Lottie from 'lottie-react';
import successAnimation from '@/animations/success.json';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-bg)] px-4 py-12 text-center space-y-8">
      {/* Success Icon */}
      <div className="w-64 h-64 relative">
        <Lottie animationData={successAnimation} loop={false} />
      </div>

      {/* Success Message */}
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--acc-clr)] pry-ff">
        Order Placed Successfully!
      </h1>
      <p className="text-[var(--txt-clr)] sec-ff max-w-md">
        Thank you for your purchase. Your order has been received and is now being processed.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 mt-8">
        <Link
          href="/dashboard/my-orders"
          className="px-8 py-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] font-medium sec-ff hover:opacity-90 transition"
        >
          View My Orders
        </Link>
        <Link
          href="/dashboard"
          className="px-8 py-3 rounded-lg border border-[var(--acc-clr)] text-[var(--acc-clr)] font-medium sec-ff hover:bg-[var(--acc-clr)] hover:text-[var(--bg-clr)] transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}