'use client';

import { useState } from 'react';
import AcctModal from '@/components/acct-modal';

export default function Introduction() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  return (
    <>
      <section className="flex flex-col gap-6 w-full max-w-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl text-[var(--txt-clr)] font-bold pry-ff leading-tight">
          Shop. Share. Grow the Market.
        </h1>
        <p className="sec-ff text-[var(--txt-clr)] text-sm md:text-base leading-relaxed">
          We’re inviting a few early players to help shape the future of buyer-powered product marketing.
        </p>

        <button
          onClick={handleModal}
          className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-6 py-3 rounded-lg transition-all duration-300 sec-ff font-semibold w-fit cursor-pointer
            hover:shadow-[0_0_15px_#2DCAD7] hover:brightness-110"
        >
          Join the Waitlist
        </button>
      </section>

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