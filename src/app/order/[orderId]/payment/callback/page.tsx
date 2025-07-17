'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Lottie from 'lottie-react';
import Link from 'next/link';
import successAnimation from '@/animations/success.json';
import failedAnimation from '@/animations/failure.json';

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();

  const reference = searchParams.get('reference');

  useEffect(() => {
    async function verifyPayment() {
      try {
        const res = await fetch(`/api/payment/callback?reference=${reference}`);
        const data = await res.json();

        if (data.status === 'success') {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage('Payment verification failed.');
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setStatus('error');
        setMessage('An error occurred while verifying payment.');
      }
    }

    if (reference) verifyPayment();
  }, [reference]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-[var(--acc-clr)] sec-ff">
        Verifying payment...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center space-y-4">
        <div className="w-24 h-24 relative">
            <Lottie animationData={failedAnimation} loop={false} />
        </div>
        <h2 className="text-2xl font-bold text-red-600 pry-ff">Payment Failed</h2>
        <Link href="/explore" className="text-[var(--acc-clr)] underline cursor-pointer sec-ff">Go back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-bg)] px-4 py-12 text-center space-y-6">
      <div className="w-24 h-24 relative">
        <Lottie animationData={successAnimation} loop={false} />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--acc-clr)] pry-ff">
        Payment Verified!
      </h1>
      <p className="text-[var(--txt-clr)] sec-ff max-w-md">
        {message}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link
          href="/dashboard/my-orders/get-orders"
          className="px-6 py-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] font-medium sec-ff hover:opacity-90 transition cursor-pointer">
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