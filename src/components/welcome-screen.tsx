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
          {/* Back hill - darker, peaks on the right */}
          <path
            d="M0 260 L1440 260 L1440 60 C1300 40, 1100 60, 900 100 C700 140, 400 200, 200 230 C100 245, 40 255, 0 260 Z"
            fill="var(--wave-clr)"
          />
          {/* Front hill - lighter, smaller, peaks on the left */}
          <path
            d="M0 260 L1440 260 L1440 240 C1300 250, 1100 255, 900 250 C700 245, 500 240, 300 220 C150 190, 60 160, 0 180 Z"
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