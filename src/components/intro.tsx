'use client';

import { useState } from 'react';

export default function Introduction() {
    const [isOpenModal, setIsOpenModal] = useState(false);

    const handleModal = () => {
        setIsOpenModal(!isOpenModal);
    }
    return (
      <section className="flex flex-col gap-6 w-full max-w-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl text-[var(--txt-clr)] font-bold pry-ff leading-tight">
          Shop. Share. Grow the Market.
        </h1>
        <p className="sec-ff text-[var(--txt-clr)] text-sm md:text-base leading-relaxed">
          We’re inviting a few early players to help shape the future of buyer-powered product marketing.
        </p>
  
        <button
            className="bg-[var(--acc-clr)] text-[var(--bg-clr)] px-6 py-3 rounded-lg transition-all duration-300 sec-ff font-semibold w-fit cursor-pointer
             hover:shadow-[0_0_15px_#2DCAD7] hover:brightness-110"
        >
            Join the Waitlist
        </button>
      </section>
    );
}  