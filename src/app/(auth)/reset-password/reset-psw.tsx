"use client";

import { ResetPsw } from "@/lib/reset-psw";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await ResetPsw(email, otp, newPassword);
      toast.success(res?.message || "Password reset successful");
      setEmail("");
      setOtp("");
      setNewPassword("");
      router.push("/login");
    } catch (err) {
      console.log(err);
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[var(--light-bg)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg"
      >
        <h1 className="text-xl font-semibold text-[var(--txt-clr)] mb-4 pry-ff">
          Reset Password
        </h1>
        <p className="text-sm text-[var(--acc-clr)] mb-4 sec-ff">
          Enter your email, OTP, and a new password to reset your account.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 border border-[var(--acc-clr)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] text-[var(--txt-clr)] bg-white/10 placeholder:text-white/70 sec-ff"
        />

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border border-[var(--acc-clr)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] text-[var(--txt-clr)] bg-white/10 placeholder:text-white/70 sec-ff"
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full px-4 py-2 border border-[var(--acc-clr)] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] text-[var(--txt-clr)] bg-white/10 placeholder:text-white/70 sec-ff"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--acc-clr)] text-[var(--bg-clr)] py-2 px-4 rounded-lg transition disabled:opacity-50 sec-ff font-semibold cursor-pointer"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </main>
  );
}
