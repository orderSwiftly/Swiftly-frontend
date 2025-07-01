'use client';

import Link from 'next/link';
// import Image from 'next/image';
import Lottie from 'lottie-react';
import successAnimation from '@/animations/blue-gif.json';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-bg)] px-4 py-12 text-center space-y-6">
      {/* ✅ Success Icon */}
      <div className="w-24 h-24 relative">
      <Lottie animationData={successAnimation} loop={false} />
      </div>

      {/* ✅ Success Message */}
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--acc-clr)] pry-ff">
        Order Placed Successfully!
      </h1>
      <p className="text-[var(--txt-clr)] sec-ff max-w-md">
        Thank you for your purchase. Your order has been received and is now being processed.
      </p>

      {/* ✅ Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link
          href="/dashboard/my-orders"
          className="px-6 py-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] font-medium sec-ff hover:opacity-90 transition"
        >
          View My Orders
        </Link>
        <Link
          href="/explore"
          className="px-6 py-3 rounded-lg border border-[var(--acc-clr)] text-[var(--acc-clr)] font-medium sec-ff hover:bg-[var(--acc-clr)] hover:text-[var(--bg-clr)] transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}