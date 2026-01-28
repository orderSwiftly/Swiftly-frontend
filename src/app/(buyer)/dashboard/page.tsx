'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DashboardPage from '@/components/dashboard-page';
import ComplaintButton from '@/components/complaint-btn';
import ComplaintModal from '@/components/complaint-modal';
import WelcomeScreen from '@/components/welcome-screen';
import Onboarding from '@/components/onboarding';
import SelectCampus from '@/components/select-campus';

import { useUIStore } from '@/stores/campusStore';

export default function DashboardHome() {
    const router = useRouter();

    const { showCampus, openCampus, closeCampus } = useUIStore();

    const [showComplaint, setShowComplaint] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const seenWelcome = sessionStorage.getItem('seen-welcome');
        const seenOnboarding = localStorage.getItem('seen-onboarding');
        const selectedCampus = localStorage.getItem('selected-campus');

        if (!token) {
            router.push('/dashboard/login');
            return;
        }

        if (!seenWelcome) {
            setShowWelcome(true);
            return;
        }

        if (!seenOnboarding) {
            setShowOnboarding(true);
            return;
        }

        if (!selectedCampus) {
            openCampus();
        }
    }, [router, openCampus]);

    return (
        <>
            {showWelcome && (
                <WelcomeScreen
                    onFinish={() => {
                        sessionStorage.setItem('seen-welcome', 'true');
                        setShowWelcome(false);
                    }}
                />
            )}

            {!showWelcome && showOnboarding && (
                <Onboarding
                    onFinish={() => {
                        localStorage.setItem('seen-onboarding', 'true');
                        setShowOnboarding(false);
                    }}
                />
            )}

            {showCampus && (
                <SelectCampus
                    onFinish={() => {
                        closeCampus();
                    }}
                />
            )}

            {!showWelcome && !showOnboarding && !showCampus && (
                <>
                    <DashboardPage />
                    <ComplaintButton onClick={() => setShowComplaint(true)} />
                    {showComplaint && (
                        <ComplaintModal onClose={() => setShowComplaint(false)} />
                    )}
                </>
            )}
        </>
    );
}
