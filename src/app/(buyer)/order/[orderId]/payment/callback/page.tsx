'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Lottie from 'lottie-react';
import Link from 'next/link';
import successAnimation from '@/animations/success.json';
import failedAnimation from '@/animations/failure.json';
import { CheckCircle2, Download, Share2 } from 'lucide-react';

type ErrorBlockProps = {
  title: string;
  message: string;
  reference?: string;
};

const ErrorBlock = ({ title, message, reference }: ErrorBlockProps) => (
  <div className="min-h-screen flex items-center justify-center flex-col text-center space-y-4 px-4" style={{ backgroundColor: 'var(--pry-clr)' }}>
    <div className="w-24 h-24 relative">
      <Lottie animationData={failedAnimation} loop={false} />
    </div>
    <h2 className="text-2xl font-bold text-red-500 pry-ff">{title}</h2>
    <p className="sec-ff text-sm" style={{ color: 'var(--sec-clr)' }}>{message}</p>
    {reference && (
      <p className="text-xs font-mono mt-2" style={{ color: 'var(--sec-clr)' }}>
        Reference: {reference}
      </p>
    )}
    <Link href="/dashboard/cart" className="underline sec-ff" style={{ color: 'var(--acc-clr)' }}>
      Back to Cart
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
  createdAt?: string;
  storeName?: string;
  sellerName?: string;
  sellerAccount?: string;
  sellerBank?: string;
  paymentMethod?: string;
  transactionReference?: string;
};

export default function PaymentCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'timeout' | 'missing'>('loading');
  const [message, setMessage] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') ?? undefined;
  const transactionId = searchParams.get('transaction_id') ?? undefined;
  const statusParam = searchParams.get('status') ?? undefined;

  useEffect(() => {
    if (!reference) {
      setStatus('missing');
      setMessage('Missing payment reference. Please check your payment confirmation email.');
      return;
    }

    console.log('Payment callback received:', { reference, transactionId, statusParam });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      setStatus('timeout');
      setMessage('Payment verification took too long. Please try again or contact support.');
    }, 15000);

    async function verifyPayment() {
      try {
        const api_url = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem('token');
        
        console.log('Verifying payment with reference:', reference);
        
        const res = await fetch(`${api_url}/api/v1/flutterwave/verify?reference=${reference}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          signal: controller.signal,
        });

        const data = await res.json();
        console.log('Verification response:', { status: res.status, data });
        
        clearTimeout(timeoutId);

        if (res.ok && data.status === 'success') {
          setStatus('success');
          setMessage(data.message || 'Payment confirmed successfully!');
          setOrderData({
            _id: data.data?.order?._id,
            pricing: data.data?.order?.pricing,
            deliveryCode: data.data?.order?.deliveryCode,
            createdAt: data.data?.order?.createdAt,
            storeName: data.data?.order?.storeName || data.data?.order?.sellerName || 'Swiftly Store',
            sellerName: data.data?.order?.sellerName || 'Swiftly Merchant',
            sellerAccount: data.data?.order?.sellerAccount || '****1234',
            sellerBank: data.data?.order?.sellerBank || 'Access Bank',
            paymentMethod: 'Card Payment',
            transactionReference: reference,
          });
        } else if (res.status === 404) {
          setStatus('error');
          setMessage('Order not found. Please contact support with your payment reference.');
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
  }, [reference, transactionId, statusParam]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Apr 5th, 2026 · 22:21:21';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) + ' · ' + date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center space-y-4" style={{ backgroundColor: 'var(--pry-clr)' }}>
        <div className="w-16 h-16 border-4 border-[var(--acc-clr)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-semibold sec-ff" style={{ color: 'var(--acc-clr)' }}>Verifying payment...</p>
        <p className="text-sm sec-ff" style={{ color: 'var(--sec-clr)' }}>Please wait while we confirm your payment</p>
        {reference && (
          <p className="text-xs font-mono" style={{ color: 'var(--sec-clr)' }}>Reference: {reference}</p>
        )}
      </div>
    );
  }

  if (status === 'timeout') return <ErrorBlock title="Verification Timed Out" message={message} reference={reference} />;
  if (status === 'error') return <ErrorBlock title="Payment Verification Failed" message={message} reference={reference} />;
  if (status === 'missing') return <ErrorBlock title="Missing Reference" message={message} />;

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--pry-clr)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Success Animation */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 relative">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold pry-ff mb-2" style={{ color: 'var(--acc-clr)' }}>
            Payment Successful!
          </h1>
          <p className="sec-ff text-sm" style={{ color: 'var(--sec-clr)' }}>{message}</p>
        </div>

        {/* Receipt Card */}
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--dark-bg)' }}>
          {/* Header */}
          <div className="text-center py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <h2 className="text-2xl font-bold pry-ff" style={{ color: 'var(--acc-clr)' }}>swiftly</h2>
            <p className="text-xs sec-ff mt-1" style={{ color: 'var(--sec-clr)' }}>RECEIPT</p>
          </div>

          {/* Amount */}
          <div className="text-center py-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <p className="text-4xl md:text-5xl font-bold pry-ff" style={{ color: 'var(--acc-clr)' }}>
              ₦{orderData?.pricing?.total?.toLocaleString() || '0'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <CheckCircle2 size={16} style={{ color: 'var(--acc-clr)' }} />
              <span className="text-sm sec-ff" style={{ color: 'var(--acc-clr)' }}>Successful</span>
            </div>
            <p className="text-xs sec-ff mt-2" style={{ color: 'var(--sec-clr)' }}>
              {formatDate(orderData?.createdAt)}
            </p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {/* Recipient */}
            <div className="flex justify-between items-start">
              <span className="text-sm sec-ff" style={{ color: 'var(--sec-clr)' }}>Recipient</span>
              <div className="text-right">
                <p className="text-sm font-semibold sec-ff" style={{ color: 'var(--txt-clr)' }}>
                  {orderData?.sellerName || 'Swiftly Merchant'}
                </p>
                <p className="text-xs sec-ff" style={{ color: 'var(--sec-clr)' }}>
                  {orderData?.sellerBank || 'Access Bank'} · {orderData?.sellerAccount || '****1234'}
                </p>
              </div>
            </div>

            {/* Sender */}
            <div className="flex justify-between items-start">
              <span className="text-sm sec-ff" style={{ color: 'var(--sec-clr)' }}>Sender</span>
              <div className="text-right">
                <p className="text-sm font-semibold sec-ff" style={{ color: 'var(--txt-clr)' }}>You</p>
                <p className="text-xs sec-ff" style={{ color: 'var(--sec-clr)' }}>
                  {orderData?.paymentMethod || 'Card Payment'} · ****4242
                </p>
              </div>
            </div>

            {/* Remark/Store */}
            <div className="flex justify-between items-start">
              <span className="text-sm sec-ff" style={{ color: 'var(--sec-clr)' }}>Store</span>
              <p className="text-sm sec-ff text-right" style={{ color: 'var(--txt-clr)' }}>
                {orderData?.storeName || 'Swiftly Store'}
              </p>
            </div>

            {/* Order ID (instead of Transaction no.) */}
            <div className="flex justify-between items-start">
              <span className="text-sm sec-ff" style={{ color: 'var(--sec-clr)' }}>Order ID</span>
              <p className="text-sm sec-ff font-mono text-right" style={{ color: 'var(--txt-clr)' }}>
                {orderData?._id?.slice(-12) || 'N/A'}
              </p>
            </div>

            {/* Session ID / Reference */}
            <div className="flex justify-between items-start">
              <span className="text-sm sec-ff" style={{ color: 'var(--sec-clr)' }}>Reference</span>
              <p className="text-xs sec-ff font-mono text-right break-all max-w-[60%]" style={{ color: 'var(--sec-clr)' }}>
                {reference || 'N/A'}
              </p>
            </div>

            {/* Delivery Code if available */}
            {orderData?.deliveryCode && (
              <div className="flex justify-between items-start">
                <span className="text-sm sec-ff" style={{ color: 'var(--sec-clr)' }}>Delivery Code</span>
                <p className="text-sm sec-ff font-mono" style={{ color: 'var(--acc-clr)' }}>
                  {orderData.deliveryCode}
                </p>
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="pt-4 mt-2 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <div className="flex justify-between text-sm">
                <span className="sec-ff" style={{ color: 'var(--sec-clr)' }}>Subtotal</span>
                <span className="sec-ff" style={{ color: 'var(--txt-clr)' }}>₦{orderData?.pricing?.subtotal?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="sec-ff" style={{ color: 'var(--sec-clr)' }}>Service Fee</span>
                <span className="sec-ff" style={{ color: 'var(--txt-clr)' }}>₦{orderData?.pricing?.serviceFee?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="sec-ff" style={{ color: 'var(--sec-clr)' }}>Delivery Fee</span>
                <span className="sec-ff" style={{ color: 'var(--txt-clr)' }}>₦{orderData?.pricing?.deliveryFee?.toLocaleString() || '0'}</span>
              </div>
            </div>
          </div>

          {/* Footer with Buttons */}
          <div className="p-6 border-t space-y-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex gap-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--prof-clr)' }}
              >
                <Download size={18} style={{ color: 'var(--txt-clr)' }} />
                <span className="sec-ff text-sm font-medium" style={{ color: 'var(--txt-clr)' }}>Download</span>
              </button>
              <button 
                onClick={() => navigator.share?.({
                  title: 'Swiftly Receipt',
                  text: `Payment of ₦${orderData?.pricing?.total?.toLocaleString()} to ${orderData?.storeName}`,
                  url: window.location.href,
                }).catch(() => {})}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                style={{ backgroundColor: 'var(--bg-clr)' }}
              >
                <Share2 size={18} style={{ color: 'var(--txt-clr)' }} />
                <span className="sec-ff text-sm font-medium" style={{ color: 'var(--txt-clr)' }}>Share</span>
              </button>
            </div>

            <p className="text-center text-xs sec-ff pt-2" style={{ color: 'var(--sec-clr)' }}>
              Powered by Swiftly. Transactions are secured and insured.
              <br />
              Keep this receipt as proof of payment.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            href="/dashboard/my-orders"
            className="flex-1 text-center py-3 rounded-xl font-medium sec-ff transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--acc-clr)', color: 'var(--pry-clr)' }}
          >
            View My Orders
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 text-center py-3 rounded-xl font-medium sec-ff transition-opacity hover:opacity-80 border"
            style={{ borderColor: 'var(--acc-clr)', color: 'var(--acc-clr)' }}
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support Link */}
        <div className="text-center mt-8">
          <Link href="/dashboard/profile/support" className="text-sm underline sec-ff" style={{ color: 'var(--sec-clr)' }}>
            Need help? Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}