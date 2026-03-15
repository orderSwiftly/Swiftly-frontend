'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Lottie from 'lottie-react';
import Link from 'next/link';
import successAnimation from '@/animations/success.json';
import failedAnimation from '@/animations/failure.json';
import ReceiptButton from '@/components/ReceiptButton';

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
    <Link href="/dashboard" className="text-[var(--acc-clr)] underline sec-ff">
      Back to Dashboard
    </Link>
  </div>
);

interface Pricing {
  subtotal: number;
  serviceFee: number;
  deliveryFee: number;
  total: number;
}

type OrderData = {
  _id?: string;
  pricing?: Pricing;
  deliveryCode?: string;
};

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'timeout' | 'missing'>('loading');
  const [message, setMessage] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (!reference) {
      setStatus('missing');
      setMessage('Missing payment reference. Please check your payment confirmation email.');
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setStatus('timeout');
      setMessage('Payment verification took too long. Please try again or contact support.');
    }, 15000);

    async function verifyPayment() {
      try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${api_url}/api/v1/paystack/verify?reference=${reference}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
        });

        const data = await res.json();
        clearTimeout(timeoutId);

        if (res.ok && data.status === 'success') {
          setStatus('success');
          setMessage(data.message || 'Payment confirmed successfully!');
          setOrderData({
            _id: data.data?.order?._id,
            pricing: data.data?.order?.pricing,
            deliveryCode: data.data?.order?.deliveryCode,
          });
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed. Please contact support.');
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
        clearTimeout(timeoutId);
        console.error('Payment verification error:', err);
        setStatus('error');
        setMessage('Network error occurred while verifying payment. Please check your connection and try again.');
      }
    }

    verifyPayment();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [reference]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center space-y-4">
        <div className="w-16 h-16 border-4 border-[var(--acc-clr)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-semibold text-[var(--acc-clr)] sec-ff">Verifying payment...</p>
        <p className="text-sm text-gray-500 sec-ff">Please wait while we confirm your payment</p>
      </div>
    );
  }

  if (status === 'timeout') return <ErrorBlock title="Verification Timed Out" message={message} />;
  if (status === 'error') return <ErrorBlock title="Payment Verification Failed" message={message} />;
  if (status === 'missing') return <ErrorBlock title="Missing Reference" message={message} />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--light-bg)] px-4 py-12 text-center space-y-6">
      <div className="w-32 h-32 relative">
        <Lottie animationData={successAnimation} loop={false} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--acc-clr)] pry-ff">Payment Verified!</h1>
        <p className="text-lg text-green-600 font-medium sec-ff">Transaction Successful</p>
      </div>

      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg border">
        <p className="text-[var(--acc-clr)] sec-ff mb-4">{message}</p>

        {orderData && (
          <div className="text-sm text-gray-600 sec-ff space-y-2">
            <div className="flex justify-between">
              <span className="font-bold">Order ID:</span>
              <span className="font-mono">{orderData._id?.slice(-8)}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-bold">Subtotal:</span>
              <span>₦{orderData.pricing?.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Service Fee:</span>
              <span>₦{orderData.pricing?.serviceFee?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Delivery Fee:</span>
              <span>₦{orderData.pricing?.deliveryFee?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-[var(--acc-clr)]">
              <span>Total:</span>
              <span>₦{orderData.pricing?.total?.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-bold">Delivery Code:</span>
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">{orderData.deliveryCode}</span>
            </div>

            <div className="pt-4">
              <ReceiptButton
                orderId={orderData._id ?? 'Unknown'}
                pricing={orderData.pricing ?? { subtotal: 0, serviceFee: 0, deliveryFee: 0, total: 0 }}
                deliveryCode={orderData.deliveryCode ?? 'N/A'}
                fullname="Customer"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/dashboard/my-orders"
          className="px-8 py-3 rounded-lg bg-[var(--acc-clr)] text-[var(--bg-clr)] font-medium sec-ff hover:opacity-90 transition-opacity cursor-pointer"
        >
          View My Orders
        </Link>
        <Link
          href="/dashboard"
          className="px-8 py-3 rounded-lg border border-[var(--acc-clr)] text-[var(--acc-clr)] font-medium sec-ff hover:bg-[var(--acc-clr)] hover:text-[var(--bg-clr)] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500 sec-ff">
          Need help? <Link href="/contact" className="text-[var(--acc-clr)] underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
}