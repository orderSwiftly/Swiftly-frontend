import { Suspense } from 'react';
import InitializePayment from './InitializePayment';
import PulseLoader from '@/components/pulse-loader';

export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { orderId: string } }) {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full flex items-center justify-center bg-[var(--light-bg)]">
          <PulseLoader />
        </div>
      }
    >
      <InitializePayment orderId={params.orderId} />
    </Suspense>
  );
}