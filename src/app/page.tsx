'use client'

import Navigation from "@/components/navigation";
import LandingPage from "@/components/landing-page";
import ComplaintButton from "@/components/complaint-btn";
import ComplaintModal from "@/components/complaint-modal";
import { useState } from "react";

export default function Home() {
  const [showComplaint, setShowComplaint] = useState(false);
  return (
    <main className="min-h-screen w-full bg-[var(--bg-clr)] flex flex-col items-center justify-start relative">
      <Navigation />
      <LandingPage />
      {/* Floating Button */}
      <ComplaintButton onClick={() => setShowComplaint(true)} />

      {/* Modal */}
      {showComplaint && <ComplaintModal onClose={() => setShowComplaint(false)} />}
    </main>
  );
}