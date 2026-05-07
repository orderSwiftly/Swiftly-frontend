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
      {/* Wavy line layers instead of rounded tops */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none">
        <svg
          className="w-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back layer - darkest wave */}
          <path
            d="M0 400 L1440 400 L1440 300 C1300 240, 1100 280, 900 250 C700 220, 500 180, 300 210 C100 240, 50 270, 0 300 Z"
            fill="var(--wave-clr)"
            opacity="0.8"
          />
          {/* Mid layer */}
          <path
            d="M0 400 L1440 400 L1440 250 C1300 200, 1100 240, 900 210 C700 180, 500 140, 300 170 C100 200, 50 230, 0 250 Z"
            fill="var(--prof-clr)"
            opacity="0.9"
          />
          {/* Front layer - brightest wave */}
          <path
            d="M0 400 L1440 400 L1440 200 C1300 160, 1100 190, 900 170 C700 150, 500 120, 300 140 C100 160, 50 180, 0 200 Z"
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