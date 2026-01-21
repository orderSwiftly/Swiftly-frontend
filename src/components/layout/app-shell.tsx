'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SidebarProvider, useSidebar } from '@/components/sidebar-context';
import Sidebar from '@/components/sidebar';
import SidebarNav from '@/components/sidebar-nav';

function ShellContent({ children }: { children: ReactNode }) {
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
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <main
                className="flex-1 transition-all duration-300"
                style={{
                    marginLeft: isDesktop ? (collapsed ? '5rem' : '16rem') : '0',
                }}
            >
                {/* Top nav */}
                <SidebarNav />

                <div className="pt-2">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function AppShell({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <ShellContent>{children}</ShellContent>
        </SidebarProvider>
    );
}
