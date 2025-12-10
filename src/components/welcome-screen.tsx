'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';

type Props = {
  onFinish: () => void;
};

export default function WelcomeScreen({ onFinish }: Readonly<Props>) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-[#119a7d] overflow-hidden fixed inset-0 z-[999] pry-ff">

      {/* Hills / Curves */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-[#5f7f1a] rounded-t-[100%] opacity-80" />
      <div className="absolute bottom-0 left-0 w-full h-[30%] bg-[#7fae2a] rounded-t-[100%]" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="z-10"
      >
        <motion.h1
          initial={{ letterSpacing: '0.6em' }}
          animate={{ letterSpacing: '0.15em' }}
          transition={{ duration: 1.5 }}
          className="text-white text-3xl md:text-4xl font-bold tracking-[0.15em] pry-ff"
        >
          SWIFTLY
        </motion.h1>
      </motion.div>
    </main>
  );
}