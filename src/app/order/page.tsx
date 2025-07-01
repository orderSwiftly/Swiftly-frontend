// app/order/page.tsx
'use client';

import NewOrder from './new-order';
import Navigation from '@/components/navigation';

export default function OrderPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] flex flex-col">
          <Navigation />
          <div className="flex-1 pt-24 px-4 sm:px-6">
            <NewOrder />
          </div>
    </main>
  );
}       