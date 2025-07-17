'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const reference = searchParams.get('reference');
  const orderId = params.orderId;

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

  useEffect(() => {
    if (!reference || !orderId) {
      setStatus('failed');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`/api/payment/verify?reference=${reference}`);
        const data = await res.json();
        if (data.status === 'success') {
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch {
        setStatus('failed');
      }
    };

    verifyPayment();
  }, [reference, orderId]);

  if (status === 'verifying') return <p>Verifying payment...</p>;
  if (status === 'success') return <h2>🎉 Payment Successful!</h2>;
  return <h2>❌ Payment Failed</h2>;
}
