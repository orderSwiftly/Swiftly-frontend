'use client';

import { X } from 'lucide-react';

export default function AcctModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--bg-clr)] text-[var(--txt-clr)] rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--txt-clr)] cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl md:text-3xl font-bold pry-ff mb-2">Register</h2>
        <p className="text-sm md:text-base sec-ff text-[var(--txt-clr)] mb-6">
          Join the marketplace early! Fill in your details below.
        </p>

        {/* Form Fields */}
        <form className="flex flex-col gap-4 sec-ff">
          <input
            type="text"
            placeholder="Fullname"
            className="w-full p-3 rounded-lg bg-white/10 placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/10 placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
          />

          <button
            type="submit"
            className="mt-4 bg-[var(--acc-clr)] text-[var(--bg-clr)] px-6 py-3 rounded-lg font-semibold hover:shadow-[0_0_15px_#2DCAD7] hover:brightness-110 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}