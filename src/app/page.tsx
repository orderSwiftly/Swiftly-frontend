'use client';

import Navigation from "@/components/navigation";
import LandingPage from "@/components/landing-page";
import ComplaintButton from "@/components/complaint-btn";
import ComplaintModal from "@/components/complaint-modal";
import WelcomeScreen from "@/components/welcome-screen";
import Onboarding from "@/components/onboarding";
import SelectCampus from "@/components/select-campus";
import { useState, useEffect } from "react";

export default function Home() {
  const [showComplaint, setShowComplaint] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCampus, setShowCampus] = useState(false);

  useEffect(() => {
    const seenWelcome = sessionStorage.getItem("seen-welcome");
    const seenOnboarding = localStorage.getItem("seen-onboarding");
    const selectedCampus = localStorage.getItem("selected-campus");

    if (seenWelcome) setShowWelcome(false);
    if (!seenOnboarding && seenWelcome) setShowOnboarding(true);
    if (seenOnboarding && !selectedCampus) setShowCampus(true);
  }, []);

  const closeWelcome = () => {
    sessionStorage.setItem("seen-welcome", "true");
    setShowWelcome(false);
    setShowOnboarding(true);
  };

  const closeOnboarding = () => {
    localStorage.setItem("seen-onboarding", "true");
    setShowOnboarding(false);
    setShowCampus(true);
  };

  const closeCampus = () => {
    setShowCampus(false);
  };

  return (
    <main className="min-h-screen w-full bg-[#006B4F] flex flex-col items-center justify-start relative">

      {showWelcome && <WelcomeScreen onFinish={closeWelcome} />}

      {!showWelcome && showOnboarding && (
        <Onboarding onFinish={closeOnboarding} />
      )}

      {!showWelcome && !showOnboarding && showCampus && (
        <SelectCampus onFinish={closeCampus} />
      )}

      {!showWelcome && !showOnboarding && !showCampus && (
        <>
          <Navigation />
          <LandingPage />
          <ComplaintButton onClick={() => setShowComplaint(true)} />
          {showComplaint && (
            <ComplaintModal onClose={() => setShowComplaint(false)} />
          )}
        </>
      )}

    </main>
  );
}