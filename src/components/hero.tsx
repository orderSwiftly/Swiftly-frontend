'use client';

import Image from 'next/image';

export default function FirstHero() {
  return (
    <section className="relative w-full max-w-lg mx-auto p-6 rounded-2xl overflow-hidden">
      <Image
        src="/coffee_hero.png" // put the exact file name from /public here
        alt="Hero Image"
        width={500}
        height={500}
        className="w-full h-auto object-cover rounded-2xl"
        priority
      />
    </section>
  );
}
