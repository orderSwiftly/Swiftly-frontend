'use client';

import { SidebarProvider, useSidebar } from '@/components/sidebar-context';
import Sidebar from '@/components/sidebar';
import SidebarNav from '@/components/sidebar-nav';
import AuthProvider from '@/components/providers/AuthProvider';
import { ReactNode, useEffect, useState } from 'react';

function DashboardContent({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (left) */}
      <Sidebar />

      {/* Main area */}
      <main
        className="flex-1 bg-[var(--light-bg)] transition-all duration-300"
        style={{
          marginLeft: isDesktop ? (collapsed ? '5rem' : '16rem') : '0',
        }}
      >
        <AuthProvider>
          {/* TOP NAV — appears on ALL dashboard pages */}
          <SidebarNav />

          {/* Page content */}
          <div className="pt-2">
            {children}
          </div>
        </AuthProvider>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}