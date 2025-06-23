// app/dashboard/layout.tsx
'use client';

import Sidebar from '@/components/sidebar';

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 bg-[var(--light-bg)]">{children}</main>
    </div>
  );
}