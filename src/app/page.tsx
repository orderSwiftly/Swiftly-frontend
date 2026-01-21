'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/navigation';
import LandingPage from '@/components/landing-page';
import DashboardPage from '@/components/dashboard-page';
import ComplaintButton from '@/components/complaint-btn';
import ComplaintModal from '@/components/complaint-modal';
import WelcomeScreen from '@/components/welcome-screen';
import Onboarding from '@/components/onboarding';
import SelectCampus from '@/components/select-campus';

export default function Home() {
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
      if (!seenWelcome) setShowWelcome(true);
      else router.push('/');
    } else {
      if (!seenWelcome) setShowWelcome(true);
      else if (!seenOnboarding) setShowOnboarding(true);
      else if (!selectedCampus) setShowCampus(true);
    }
  }, []);

  const closeWelcome = () => {
    sessionStorage.setItem('seen-welcome', 'true');
    setShowWelcome(false);

    const token = localStorage.getItem('token');
    if (token) {
      const seenOnboarding = localStorage.getItem('seen-onboarding');
      const selectedCampus = localStorage.getItem('selected-campus');

      if (!seenOnboarding) setShowOnboarding(true);
      else if (!selectedCampus) setShowCampus(true);
      else router.push('/');
    } else router.push('/');
  };

  const closeOnboarding = () => {
    localStorage.setItem('seen-onboarding', 'true');
    setShowOnboarding(false);
    setShowCampus(true);
  };

  const closeCampus = () => {
    setShowCampus(false);
    router.push('/');
  };

  return (
    <main className="min-h-screen w-full bg-(--txt-clr) flex flex-col items-center justify-start relative">
      {showWelcome && <WelcomeScreen onFinish={closeWelcome} />}
      {!showWelcome && showOnboarding && <Onboarding onFinish={closeOnboarding} />}
      {!showWelcome && !showOnboarding && showCampus && <SelectCampus onFinish={closeCampus} />}

      {!showWelcome && !showOnboarding && !showCampus && (
        <>
          <DashboardPage />
          <ComplaintButton onClick={() => setShowComplaint(true)} />
          {showComplaint && <ComplaintModal onClose={() => setShowComplaint(false)} />}
        </>
      )}
    </main>
  );
}
