'use client';

import { useState } from 'react';
import AcctModal from '@/components/acct-modal';
import { Trophy, Star, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Introduction() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModal = () => setIsOpenModal(!isOpenModal);

  const badgeStyles = (border: string, bg: string) =>
    `flex items-center gap-2 md:gap-3 px-3 py-2 rounded-full border ${border} text-[var(--txt-clr)] backdrop-blur-md ${bg}`;

  return (
    <>
      <section className="flex flex-col gap-6 w-full max-w-xl p-6 md:p-8">
        {/* Badges */}
        <motion.article
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-auto max-w-sm flex items-center justify-between gap-2 md:gap-2 sec-ff"
        >
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={badgeStyles('border-purple-400', 'bg-[rgba(192,132,252,0.15)]')}
          >
            <Trophy size={16} />
            <span className="text-[10px] md:text-[12px]">Level 12</span>
          </motion.div>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={badgeStyles('border-blue-400', 'bg-[rgba(96,165,250,0.15)]')}
          >
            <Star size={16} />
            <span className="text-[10px] md:text-[12px]">2450 XP</span>
          </motion.div>
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={badgeStyles('border-green-400', 'bg-[rgba(74,222,128,0.15)]')}
          >
            <Shield size={16} />
            <span className="text-[10px] md:text-[12px]">95% Trust</span>
          </motion.div>
        </motion.article>

        {/* Heading */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold pry-ff leading-tight bg-gradient-to-r from-[#01bbbb] via-[#75dae4] to-[#ffffff] text-transparent bg-clip-text"
        >
          Shop Smart, Review & Earn
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="sec-ff text-[var(--sec-clr)] text-sm md:text-base leading-relaxed"
        >
          The first marketplace where reviewing products earns you XP, verified sellers compete weekly,
          and every purchase is protected by our trusted escrow system.
        </motion.p>

        {/* Legend */}
        <motion.article
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex items-center justify-between gap-4 md:gap-6 sec-ff"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1 bg-purple-400 rounded-full" />
            <span className="text-sm md:text-base text-[var(--txt-clr)]">Review for XP</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1 bg-blue-400 rounded-full" />
            <span className="text-sm md:text-base text-[var(--txt-clr)]">Escrow Protection</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-1 bg-green-400 rounded-full" />
            <span className="text-sm md:text-base text-[var(--txt-clr)]">Verified Sellers</span>
          </div>
        </motion.article>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[var(--sec-clr)] sec-ff"
        >
          <Users size={16} />
          <p>The future drops soon. Get front-row access.</p>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-6 py-3 rounded-lg transition-all duration-300 sec-ff font-semibold w-fit cursor-pointer
            hover:shadow-[0_0_15px_#2DCAD7] hover:brightness-110"
        >
          <Link href="/explore">Explore our products</Link>
        </motion.button>
      </section>

      {/* Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--bg-clr)] rounded-lg shadow-lg max-w-lg w-full">
            <AcctModal onClose={handleModal} />
            <div className="flex justify-end px-6 pb-4">
              <button
                onClick={handleModal}
                className="text-[var(--acc-clr)] hover:underline font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}