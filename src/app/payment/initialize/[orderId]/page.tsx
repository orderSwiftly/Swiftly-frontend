// src/app/payment/initialize/[orderId]/page.tsx
import { Suspense } from 'react';
import InitializePayment from './InitializePayment';
import PulseLoader from '@/components/pulse-loader';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    orderId: string;
  };
}

export default function PaymentInitializePage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <PulseLoader />
        </div>
      }
    >
      <InitializePayment orderId={params.orderId} />
    </Suspense>
  );
}