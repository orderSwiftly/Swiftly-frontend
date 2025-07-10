// src/app/payment/callback/[reference]/PaymentCallbackPage.tsx

'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import successAnimation from '@/animations/success.json';
import failureAnimation from '@/animations/failure.json';
import PulseLoader from '@/components/pulse-loader';
import Link from 'next/link';

export default function PaymentCallbackPage({ reference }: { reference: string }) {
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('failed');
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/paystack/callback?reference=${reference}`,
          {
            credentials: 'include',
          }
        );

        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error('Payment verification failed:', err, reference);
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-bg)] px-4 py-12 text-center space-y-6">
      {status === 'loading' && <PulseLoader />}
      {status === 'success' && (
        <>
          <div className="w-24 h-24 relative">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--acc-clr)] pry-ff">
            Payment Successful!
          </h1>
          <p className="text-[var(--txt-clr)] sec-ff max-w-md">
            Your order has been confirmed. Thank you for shopping with us!
          </p>
          <Link
            href="/dashboard/my-orders"
            className="px-6 py-3 rounded-lg bg-[var(--acc-clr)] text-white font-medium"
          >
            View Orders
          </Link>
        </>
      )}
      {status === 'failed' && (
        <>
          <div className="w-24 h-24 relative">
            <Lottie animationData={failureAnimation} loop={false} />
          </div>
          <h1 className="text-2xl font-bold text-red-500 pry-ff">
            Payment Failed or Not Confirmed
          </h1>
          <p className="text-[var(--txt-clr)] sec-ff max-w-md">
            Something went wrong with your transaction. Please try again or contact support.
          </p>
          <Link
            href="/explore"
            className="px-6 py-3 rounded-lg border border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white"
          >
            Try Again
          </Link>
        </>
      )}
    </div>
  );
}