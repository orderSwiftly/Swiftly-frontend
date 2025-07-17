'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Lottie from 'lottie-react';
import Link from 'next/link';
import successAnimation from '@/animations/success.json';
import failedAnimation from '@/animations/failure.json';

type Status = 'loading' | 'success' | 'error';

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('error');
        setMessage('Missing payment reference.');
        return;
      }

      try {
        const res = await fetch(`/api/payment/callback?reference=${reference}`);
        const data = await res.json();

        if (res.ok && data.status === 'success') {
          setStatus('success');
          setMessage(data.message || 'Your payment has been successfully verified.');
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your payment.');
      }
    };

    verifyPayment();
  }, [reference]);

  const renderAnimation = () => (
    <div className="w-24 h-24 relative">
      <Lottie animationData={status === 'success' ? successAnimation : failedAnimation} loop={false} />
    </div>
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-[var(--acc-clr)] sec-ff">
        Verifying payment...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-bg)] px-4 py-12 text-center space-y-6">
      {renderAnimation()}

      <h1 className={`text-2xl md:text-3xl font-bold pry-ff ${status === 'success' ? 'text-[var(--acc-clr)]' : 'text-red-600'}`}>
        {status === 'success' ? 'Payment Verified!' : 'Payment Failed'}
      </h1>

      <p className="text-[var(--txt-clr)] sec-ff max-w-md">{message}</p>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {status === 'success' && (
          <Link
            href="/dashboard/my-orders/get-orders"
            className="px-6 py-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] font-medium sec-ff hover:opacity-90 transition"
          >
            View My Orders
          </Link>
        )}
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