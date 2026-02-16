'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PulseLoader from '@/components/pulse-loader';

export default function HandleTransaction({ orderId }: { orderId: string }) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/init/${orderId}`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Payment initialization failed');
            }

            // 🔥 Redirect to Paystack (NO iframe)
            window.location.href = data.data.authorization_url;
        } catch (err: any) {
            toast.error(err.message || 'Payment failed');
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-[var(--acc-clr)] text-white px-6 py-3 rounded flex items-center justify-center"
        >
            {loading ? <PulseLoader /> : 'Pay Now'}
        </button>
    );
}