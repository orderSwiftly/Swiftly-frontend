'use client';

import { useState } from 'react';
import AcctModal from '@/components/acct-modal';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Introduction() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModal = () => setIsOpenModal(!isOpenModal);

  return (
    <>
      <section className="flex flex-col gap-6 w-full max-w-xl p-6 md:p-8">
        

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
            <span className="text-sm md:text-base text-[var(--txt-clr)]">University Marketplace</span>
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