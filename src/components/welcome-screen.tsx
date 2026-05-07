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
      {/* Wavy line layers - Increased height */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg
          className="w-full"
          height="500"
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back layer - darkest wave (tallest) */}
          <path
            d="M0 500 L1440 500 L1440 380 C1300 300, 1100 360, 900 320 C700 280, 500 220, 300 260 C100 300, 50 340, 0 380 Z"
            fill="var(--wave-clr)"
            opacity="0.8"
          />
          {/* Mid layer */}
          <path
            d="M0 500 L1440 500 L1440 320 C1300 250, 1100 310, 900 270 C700 230, 500 170, 300 210 C100 250, 50 290, 0 320 Z"
            fill="var(--prof-clr)"
            opacity="0.9"
          />
          {/* Front layer - brightest wave (shortest) */}
          <path
            d="M0 500 L1440 500 L1440 260 C1300 200, 1100 240, 900 210 C700 180, 500 140, 300 170 C100 200, 50 230, 0 260 Z"
            fill="var(--acc-clr)"
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <Image src="/swiftly-txt.png" alt="Swifly Logo" width={160} height={160} className="mx-auto" />
      </motion.div>
    </main>
  );
};

export default WelcomeScreen;