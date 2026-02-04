// app/order/page.tsx
'use client';

import NewOrder from './new-order';
import SidebarNav from '@/components/sidebar-nav';

export default function OrderPage() {
  return (
    <main className="min-h-screen w-full bg-[var(--light-bg)] flex flex-col">
          <SidebarNav />
          <div className="flex-1 pt-10 pb-10 px-4 sm:px-6">
            <NewOrder />
          </div>
    </main>
  );
}       