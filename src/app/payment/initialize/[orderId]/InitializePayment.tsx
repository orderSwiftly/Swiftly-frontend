'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';

interface Props {
  orderId: string;
}

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

        // ✅ Redirect to Paystack authorization page
        window.location.href = data.data.authorization_url;
      } catch (err: unknown) {
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? (err as { message?: string }).message
            : 'Something went wrong';

        toast.error(errorMessage ?? 'Something went wrong');
        setInitializing(false);
      }
    };

    init();
  }, [orderId]);

  return (
    <div className="h-screen flex items-center justify-center">
      {initializing ? (
        <PulseLoader />
      ) : (
        <p className="text-red-500">Failed to initialize payment</p>
      )}
    </div>
  );
}