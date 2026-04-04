// src/app/(auth)/forgot-password/forgot-psw.tsx

"use client";

import { useState } from "react";
import { ForgotPsw } from "@/lib/forgot-psw";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import PulseLoader from "@/components/pulse-loader";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await ForgotPsw(email);
      toast.success(res?.message || "Password reset OTP sent to your email");
      setEmail("");
      router.push('/reset-password');
    } catch (error) {
      console.log(error)
      toast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[var(--txt-clr)] p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-xl font-semibold text-[var(--pry-clr)] mb-4 pry-ff">
          Reset Password
        </h1>
        <p className="text-sm text-[var(--pry-clr)] mb-4 sec-ff">
          Enter your email and we’ll send you an OTP to reset your password.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-[var(--acc-clr)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] text-[var(--pry-clr)] placeholder:text-white/70 sec-ff"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--acc-clr)] text-[var(--pry-clr)] py-2 px-4 rounded-lg transition disabled:opacity-50 sec-ff font-semibold cursor-pointer flex items-center justify-center"
        >
          {loading ? <PulseLoader /> : "Send OTP"}
        </button>
      </form>
    </main>
  );
}
