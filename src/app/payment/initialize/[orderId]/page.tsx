// src/app/payment/initialize/[orderId]/page.tsx

import { Suspense } from 'react';
import InitializePayment from './InitializePayment';
import PulseLoader from '@/components/pulse-loader';

type InitializePageProps = {
  params: { orderId: string };
};

export default function InitializePage({ params }: InitializePageProps) {
  const { orderId } = params;

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