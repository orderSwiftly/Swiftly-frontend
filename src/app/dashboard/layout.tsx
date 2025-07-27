// app/dashboard/layout.tsx
'use client';

import Sidebar from '@/components/sidebar';
import AuthProvider from '@/components/providers/AuthProvider';

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1">
        <AuthProvider>
          {children}
        </AuthProvider>
      </main>
    </div>
  );
}