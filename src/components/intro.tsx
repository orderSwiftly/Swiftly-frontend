'use client';

import { useState } from 'react';
import AcctModal from '@/components/acct-modal';
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
          className="text-3xl md:text-4xl font-bold pry-ff leading-tight text-white bg-clip-text"
        >
          Live Your Campus Life, <span className='text-[var(--acc-clr)]'>Uninterrupted.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="sec-ff text-[var(--sec-clr)] text-sm md:text-base leading-relaxed"
        >
          Fuel your study sessions, stock your hostel room, and handle every campus errand without ever waiting in line. Get anything you need, from snacks to school supplies, delivered from local campus shops in minutes.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-6 py-3 rounded-lg transition-all duration-300 sec-ff font-semibold w-fit cursor-pointer
            hover:shadow-[0_0_15px_#9BDD37] hover:brightness-110"
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