'use client';

import {
  PackageCheck,
  ShieldCheck,
  GraduationCap,
  Users,
  Truck,
  Undo2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const highlights = [
  {
    icon: PackageCheck,
    title: 'Escrow by Default',
    description:
      'Payments are held until buyers confirm satisfaction. No more “what I ordered vs what I got.”',
  },
  {
    icon: GraduationCap,
    title: 'Smart Buyer Verification',
    description:
      'Every buyer is verified through student emails (or equivalent identity layers) to block burner accounts and fake purchases.',
  },
  {
    icon: Users,
    title: 'Dispute Resolution with Jury Review',
    description:
      'Complex complaints? Our anonymous peer jury resolves them with fairness. Jurors are paid. Trust is protected.',
  },
  {
    icon: ShieldCheck,
    title: 'Sellers Earn Reputation, Not Just Sales',
    description:
      'Top sellers gain visibility, lower fees, and verified badges. Score decays if trust slips.',
  },
  {
    icon: Truck,
    title: 'Pickup Integrity',
    description:
      'QR-verified handoffs at campus zones, cafés, or approved locations — reducing drop scams and ghost buyers.',
  },
  {
    icon: Undo2,
    title: 'Returns without the Chaos',
    description:
      'Returns are fast, fair, and evidence-backed — with optional negotiation for non-defective returns during escrow.',
  },
];

export default function WhatSetsUsApart() {
  return (
    <section className="bg-white text-[var(--bg-clr)] px-6 py-16">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-[var(--bg-clr)] pry-ff"
        >
          What Sets Us Apart
        </motion.h2>

        {/* Highlights Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.2 }}
        >
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true, amount: 0.5 }}
              className="flex flex-col items-start gap-4 p-5 bg-white border border-gray-100 rounded-xl shadow-md text-left hover:transform hover:scale-103 transition-transform duration-500 ease-in-out cursor-pointer"
            >
              <item.icon className="w-6 h-6 text-cyan-500" />
              <div>
                <h3 className="font-semibold text-lg pry-ff mb-1">{item.title}</h3>
                <p className="text-sm text-gray-700 sec-ff leading-snug">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}