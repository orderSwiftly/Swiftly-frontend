// app/payment/initialize/[orderId]/page.tsx
'use client';

import { Suspense } from 'react';
import InitializePayment from './InitializePayment';
import PulseLoader from '@/components/pulse-loader';

export const dynamic = 'force-dynamic';

export default function PaymentInitializePage({
  params,
}: {
  readonly params: { readonly orderId: string };
}) {
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
