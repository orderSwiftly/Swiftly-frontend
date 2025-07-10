// src/app/payment/initialize/[orderId]/page.tsx

import { Suspense } from 'react';
import InitializePayment from './InitializePayment';
import PulseLoader from '@/components/pulse-loader';

export default async function InitializePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[var(--light-bg)] flex items-center justify-center">
          <PulseLoader />
        </div>
      }
    >
      <InitializePayment orderId={orderId} />
    </Suspense>
  );
}