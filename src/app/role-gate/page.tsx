// src/app/role-gate/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useUIStore } from '@/stores/campusStore';
import SelectCampus from '@/components/select-campus';

export default function DashboardRouter() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, fetchUser } = useUserStore();
    const { showCampus, openCampus, closeCampus } = useUIStore();

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated || !user) {
            router.replace('/login');
            return;
        }

        if (user.role === 'rider') {
            router.replace('/rider/dashboard');
            return;
        }

        const selectedCampus = localStorage.getItem('selected-campus');
        if (!selectedCampus) {
            openCampus();
            return;
        }

        router.replace('/dashboard');
    }, [user, isAuthenticated, isLoading, router, openCampus]);

    if (showCampus) {
        return (
            <SelectCampus
                onFinish={() => {
                    closeCampus();
                    router.replace('/dashboard');
                }}
            />
        );
    }

    return null;
}