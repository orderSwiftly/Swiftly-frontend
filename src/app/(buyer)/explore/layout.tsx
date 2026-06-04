// src/app/(buyer)/explore/layout.tsx

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SidebarProvider, useSidebar } from '@/components/sidebar-context';
import Sidebar from '@/components/sidebar';
import SidebarNav from '@/components/sidebar-nav';
import SelectCampus from '@/components/select-campus';
import { useUIStore } from '@/stores/campusStore';

function ExploreShell({ children }: Readonly<{ children: ReactNode }>) {
    const { collapsed } = useSidebar();
    const { showCampus, closeCampus } = useUIStore();
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main
                className="flex-1 bg-[var(--light-bg)] transition-all duration-300"
                style={{
                    marginLeft: isDesktop ? (collapsed ? '5rem' : '16rem') : '0',
                }}
            >
                <SidebarNav />
                {children}
            </main>

            {showCampus && (
                <SelectCampus onFinish={closeCampus} />
            )}
        </div>
    );
}

export default function ExploreLayout({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <SidebarProvider>
            <ExploreShell>{children}</ExploreShell>
        </SidebarProvider>
    );
}