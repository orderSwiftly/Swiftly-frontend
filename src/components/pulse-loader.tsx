'use client';

import { motion } from 'framer-motion';

export default function PulseLoader() {
  return (
    <motion.div
      className="w-6 h-6 rounded-full border-4 border-t-transparent border-[var(--bg-clr)] border-opacity-30"
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      }}
    />
  );
}