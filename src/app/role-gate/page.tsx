

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

export default function DashboardRouter() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, fetchUser } = useUserStore();

    useEffect(() => {
        // Ensure user is loaded (refresh-safe)
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (isLoading) return;

        // Not logged in
        if (!isAuthenticated || !user) {
            router.replace('/login');
            return;
        }

        // Role-based redirect
        if (user.role === 'seller') {
            router.replace('/seller/dashboard');
            return;
        }

        // Default → buyer
        router.replace('/dashboard'); // resolves to (buyer)/dashboard
    }, [user, isAuthenticated, isLoading, router]);

    return null; // nothing renders
}
