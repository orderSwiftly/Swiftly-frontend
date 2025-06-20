'use client';

import { MessageSquareWarning, PackageX, Undo2, Gamepad } from 'lucide-react';
import ReasonCard from './reasonCard';
import { motion } from 'framer-motion';
import SetUsApart from './WhatSetsUsApart';

const reasons = [
  {
    Icon: MessageSquareWarning,
    title: 'Fake Reviews',
    description: 'Combat fake reviews with our trust-first system.',
    color: 'text-red-500',
  },
  {
    Icon: PackageX,
    title: 'Delivery Fraud',
    description: 'Protect yourself from delivery fraud with secure transactions.',
    color: 'text-yellow-500',
  },
  {
    Icon: Undo2,
    title: 'Broken Return Systems',
    description: 'Seamless returns and buyer protection with dispute resolution.',
    color: 'text-green-500',
  },
];

export default function Reasons() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 px-6 py-10 bg-[var(--txt-clr)] text-center">
      {/* Top Badge */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 text-sm sec-ff text-black bg-black/10 backdrop-blur-md px-4 py-2 rounded-full shadow-md"
      >
        <Gamepad size={16} />
        <span className="font-medium">Trusted Marketplace Experience</span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-bold pry-ff text-[var(--bg-clr)]"
      >
        Why Choose Tredia?
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl text-sm md:text-base leading-relaxed text-black sec-ff"
      >
        Tredia is a trust-first commerce engine designed for modern peer-to-peer trade.
        Built for universities and beyond, it solves the three biggest threats to online transactions:
        fake reviews, delivery fraud, and broken return systems.
      </motion.p>

      {/* Reason Cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        transition={{ staggerChildren: 0.2 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 w-full max-w-7xl px-4 md:px-8"
      >
        {reasons.map((reason, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ReasonCard
              Icon={reason.Icon}
              title={reason.title}
              description={reason.description}
              color={reason.color}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* What Sets Us Apart */}
      <SetUsApart />

      {/* Bottom Badge */}
    </section>
  );
}