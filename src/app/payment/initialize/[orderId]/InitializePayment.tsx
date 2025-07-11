// src/app/payment/initialize/[orderId]/InitializePayment.tsx

'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';
import Link from 'next/link';

type Props = {
  orderId: string;
};

export default function InitializePayment({ orderId }: Props) {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!orderId) {
        toast.error('Order ID is missing');
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/paystack/initialize/${orderId}`,
          {
            method: 'POST',
            credentials: 'include',
          }
        );

        const data = await res.json();
        if (!res.ok || data.status !== 'success') {
          throw new Error(data.message ?? 'Failed to initialize payment');
        }

        window.location.href = data.data.authorization_url;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === 'string'
            ? err
            : 'Something went wrong';
        toast.error(message);
        setInitializing(false);
      }
    };

    init();
  }, [orderId]);

  return (
    <div className="min-h-screen w-full bg-[var(--light-bg)] flex flex-col items-center justify-center">
      {initializing ? (
        <PulseLoader />
      ) : (
        <div>
          <p className="text-red-500 font-semibold text-lg mb-4">
            Failed to initialize payment
          </p>
          <Link
            href="/dashboard/my-orders"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Back to Orders
          </Link>
        </div>
      )}
    </div>
  );
}