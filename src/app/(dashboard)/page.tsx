'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardPage from '@/components/dashboard-page';
import ComplaintButton from '@/components/complaint-btn';
import ComplaintModal from '@/components/complaint-modal';
import WelcomeScreen from '@/components/welcome-screen';
import Onboarding from '@/components/onboarding';
import SelectCampus from '@/components/select-campus';

export default function DashboardHome() {
    const router = useRouter();
    const [showComplaint, setShowComplaint] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showCampus, setShowCampus] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const seenWelcome = sessionStorage.getItem('seen-welcome');
        const seenOnboarding = localStorage.getItem('seen-onboarding');
        const selectedCampus = localStorage.getItem('selected-campus');

        if (!token) {
            router.push('/login');
            return;
        }

        if (!seenWelcome) setShowWelcome(true);
        else if (!seenOnboarding) setShowOnboarding(true);
        else if (!selectedCampus) setShowCampus(true);
    }, []);

    return (
        <>
            {showWelcome && <WelcomeScreen onFinish={() => setShowWelcome(false)} />}
            {!showWelcome && showOnboarding && <Onboarding onFinish={() => setShowOnboarding(false)} />}
            {!showWelcome && !showOnboarding && showCampus && <SelectCampus onFinish={() => setShowCampus(false)} />}

            {!showWelcome && !showOnboarding && !showCampus && (
                <>
                    <DashboardPage />
                    <ComplaintButton onClick={() => setShowComplaint(true)} />
                    {showComplaint && <ComplaintModal onClose={() => setShowComplaint(false)} />}
                </>
            )}
        </>
    );
}
