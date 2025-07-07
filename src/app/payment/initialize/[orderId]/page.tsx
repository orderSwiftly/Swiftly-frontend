import { Suspense } from 'react';
import InitializePayment from './InitializePayment';
import PulseLoader from '@/components/pulse-loader';

export const dynamic = 'force-dynamic';

export default function Page({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[var(--light-bg)] flex items-center justify-center">
          <PulseLoader />
        </div>
      }
    >
      <InitializePayment orderId={params.orderId} />
    </Suspense>
  );
}