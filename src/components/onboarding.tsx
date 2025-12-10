'use client';

import { useState } from 'react';
import Image from 'next/image';

type Props = {
  onFinish: () => void;
};

export default function Onboarding({ onFinish }: Readonly<Props>) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: 'Your Campus Marketplace',
      desc: 'Order anything from campus such as food, shops, services, all in one app.',
      btn: 'Next',
      img: '/marketplace_vector.png', // ✅ /public/onboarding/marketplace.png
    },
    {
      title: 'Discover with Market Map',
      desc: 'See vendor clusters around campus and find what’s near you.',
      btn: 'Next',
      img: '/Share_location.png', // ✅ /public/onboarding/map.png
    },
    {
      title: 'Ready?',
      desc: 'Welcome to your campus marketplace. Discover a faster, smarter way to campus life.',
      btn: 'Next',
      img: '/Shopping_online.png', // ✅ /public/onboarding/shop_online.png
    },
  ];

  const handleNext = () => {
    if (step === slides.length - 1) {
      onFinish();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <main className="fixed inset-0 z-[998] bg-white flex flex-col items-center justify-between px-6 py-10">

      {/* Logo */}
      <h1 className="text-sm font-bold text-[#7bd140] tracking-widest pry-ff mb-4">
        SWIFTLY
      </h1>

      {/* ✅ IMAGE FROM PUBLIC */}
      <div className="w-[320px] h-[360px] relative">
        <Image
          src={slides[step].img}
          alt={slides[step].title}
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Text */}
      <div className="text-center max-w-xs">
        <h2 className="text-xl font-bold mb-2 pry-ff mt-1">
          {slides[step].title}
        </h2>
        <p className="text-sm text-gray-600 sec-ff">
          {slides[step].desc}
        </p>
      </div>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-2 mb-4">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full ${
              i === step ? 'bg-[#7bd140]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="w-full max-w-xs flex flex-col gap-3 sec-ff">
        <button
          onClick={handleNext}
          className="w-full bg-[#7bd140] text-white py-3 rounded-lg font-semibold"
        >
          {slides[step].btn}
        </button>

        <button
          onClick={onFinish}
          className="w-full py-2 text-sm text-gray-500"
        >
          Skip
        </button>
      </div>
    </main>
  );
}
