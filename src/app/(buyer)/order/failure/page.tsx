'use client';

import Link from 'next/link';
import Lottie from 'lottie-react';
import failureAnimation from '@/animations/failure.json';

export default function OrderFailedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-bg)] px-4 py-12 text-center space-y-6">
      <div className="w-24 h-24 relative">
        <Lottie animationData={failureAnimation} loop={false} />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-red-600 pry-ff">
        Payment Failed!
      </h1>
      <p className="text-[var(--txt-clr)] sec-ff max-w-md">
        Sorry, your payment could not be processed at this time. Please contact support if the issue persists.
      </p>

      <Link
        href="/dashboard"
        className="px-6 py-3 rounded-lg bg-red-600 text-white font-medium sec-ff hover:opacity-90 transition cursor-pointer"
      >
        Continue Shopping
      </Link>
    </div>
  );
}