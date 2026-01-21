'use client';

import AuthProvider from '@/components/providers/AuthProvider';
import { ReactNode } from 'react';

export default function DashboardLayout({
    children,
}: {
    readonly children: ReactNode;
}) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}