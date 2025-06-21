'use client';

import {
  Clock,
  Mail,
  ArrowRight,
  Trophy,
  Shield,
  Star,
  Users,
} from 'lucide-react';

export default function Waitlist() {
  const waitlistItems = [
    {
      icon: Shield,
      title: 'Escrow Protection from Day One',
      color: 'text-green-400',
    },
    {
      icon: Star,
      title: '+1000 XP for Early Users',
      color: 'text-purple-400',
    },
    {
      icon: Trophy,
      title: 'Priority Seller Verification',
      color: 'text-yellow-400',
    },
  ];

  return (
    <section className="w-full py-16 bg-[var(--bg-clr)]">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center gap-6 px-4 sm:px-6">
        {/* Tag */}
        <div className="flex items-center gap-2 text-xs sm:text-sm sec-ff text-[var(--txt-clr)] bg-gradient-to-br from-[#01bbbb] to-[#05e2ff] backdrop-blur-sm px-4 py-2 rounded-full shadow-md">
          <Clock size={16} />
          <span>Limited Early Access</span>
        </div>

        {/* Heading */}
        <h1 className="pry-ff text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-[var(--acc-clr)] leading-tight sm:leading-snug">
          Ready to Join the Trusted Marketplace?
        </h1>

        {/* Paragraph */}
        <p className="max-w-2xl text-center text-sm sm:text-base md:text-md leading-relaxed text-white sec-ff px-2">
          Join thousands of verified sellers and buyers experiencing secure, gamified commerce with escrow protection and XP rewards.
        </p>

        {/* Email Waitlist Form */}
        <article className="flex flex-col gap-4 w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            {/* Email input */}
            <div className="flex items-center w-full gap-2 bg-white/20 rounded-md px-3 py-2 border sec-ff border-white/30 focus-within:border-[var(--acc-clr)] transition duration-200">
              <Mail size={18} className="text-[var(--txt-clr)]" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full bg-transparent outline-none text-[var(--txt-clr)] placeholder-white/70 text-sm"
              />
            </div>

            {/* Button */}
            <button className="w-full sm:w-auto flex flex-row items-center justify-center gap-2 text-xs sm:text-sm sec-ff text-[var(--txt-clr)] bg-gradient-to-br from-[#01bbbb] to-[#05e2ff] backdrop-blur-sm px-4 py-2 rounded-md shadow-md whitespace-nowrap cursor-pointer font-normal">
              <span>Join Waitlist</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Info with trophy */}
          <div className="flex items-center gap-2 text-white text-xs sm:text-xs mt-2 sec-ff">
            <Trophy size={15} className="text-yellow-400" />
            <span>Early adopters get verified seller status and exclusive marketplace features.</span>
          </div>
        </article>

        {/* Bonus Highlights */}
        <article className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl px-2 mt-6">
          {waitlistItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-lg shadow-md"
            >
              <item.icon size={20} className={`${item.color}`} />
              <span className="text-sm text-[var(--txt-clr)] sec-ff">{item.title}</span>
            </div>
          ))}
        </article>
        
        <div
          className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-[var(--sec-clr)] sec-ff"
        >
          <Users size={16} />
          <p>The future drops soon. Get front-row access.</p>
        </div>
      </div>
    </section>
  );
}