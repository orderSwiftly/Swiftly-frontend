import { Suspense } from 'react';
import InitializePayment from './InitializePayment';
import PulseLoader from '@/components/pulse-loader';

// Prevent static generation because we’re using search params
export const dynamic = 'force-dynamic';

export default function PaymentInitializePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <PulseLoader />
        </div>
      }
    >
      <InitializePayment />
    </Suspense>
  );
}