'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Lottie from 'lottie-react';
import Link from 'next/link';
import successAnimation from '@/animations/success.json';
import failedAnimation from '@/animations/failure.json';

type ErrorBlockProps = {
  title: string;
  message: string;
};

const ErrorBlock = ({ title, message }: ErrorBlockProps) => (
  <div className="min-h-screen flex items-center justify-center flex-col text-center space-y-4 px-4">
    <div className="w-24 h-24 relative">
      <Lottie animationData={failedAnimation} loop={false} />
    </div>
    <h2 className="text-2xl font-bold text-red-600 pry-ff">{title}</h2>
    <p className="sec-ff text-sm text-gray-500">{message}</p>
    <Link href="/explore" className="text-[var(--acc-clr)] underline sec-ff">Back to Shop</Link>
  </div>
);

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'timeout' | 'missing'>('loading');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!reference) {
      setStatus('missing');
      setMessage('Missing payment reference.');
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setStatus('timeout');
      setMessage('Payment verification took too long. Please try again.');
    }, 10000);

    async function verifyPayment() {
      try {
        const res = await fetch(`/api/v1/paystack/callback?reference=${reference}`, {
          signal: controller.signal,
        });
        const data = await res.json();

        clearTimeout(timeoutId);

        if (data.status === 'success') {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed.');
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        clearTimeout(timeoutId);
        setStatus('error');
        setMessage('An error occurred while verifying payment.');
      }
    }

    verifyPayment();

    return () => clearTimeout(timeoutId);
  }, [reference]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-[var(--acc-clr)] sec-ff">
        Verifying payment...
      </div>
    );
  }

  if (status === 'timeout') return <ErrorBlock title="Verification Timed Out" message={message} />;
  if (status === 'error') return <ErrorBlock title="Payment Failed" message={message} />;
  if (status === 'missing') return <ErrorBlock title="Missing Reference" message={message} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-bg)] px-4 py-12 text-center space-y-6">
      <div className="w-24 h-24 relative">
        <Lottie animationData={successAnimation} loop={false} />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-[var(--acc-clr)] pry-ff">
        Payment Verified!
      </h1>
      <p className="text-[var(--txt-clr)] sec-ff max-w-md">{message}</p>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link
          href="/dashboard/my-orders/get-orders"
          className="px-6 py-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] font-medium sec-ff hover:opacity-90 transition cursor-pointer"
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