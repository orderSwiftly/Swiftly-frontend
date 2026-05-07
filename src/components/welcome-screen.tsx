// src/components/welcome-screen.tsx

'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

type Props = {
  onFinish: () => void;
};

const WelcomeScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => onFinish(), 3500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-(--txt-clr) overflow-hidden fixed inset-0 z-[999] pry-ff">
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg
          className="w-full"
          height="260"
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back hill - darker, taller, offset to the right */}
          <path
            d="M0 260 L1440 260 L1440 160 C1300 140, 1100 100, 900 120 C700 140, 500 180, 300 160 C150 145, 60 155, 0 180 Z"
            fill="var(--wave-clr)"
          />
          {/* Front hill - lighter, shorter, offset to the left */}
          <path
            d="M0 260 L1440 260 L1440 200 C1200 200, 1000 220, 800 200 C600 180, 350 140, 150 170 C80 182, 30 200, 0 210 Z"
            fill="var(--acc-clr)"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2 }}
        className="z-10 flex flex-col items-center gap-2"
      >
        <Image src="/swiftly-txt.png" alt="Swiftly Logo" width={160} height={160} className="mx-auto" />
      </motion.div>
    </main>
  );
};

export default WelcomeScreen;