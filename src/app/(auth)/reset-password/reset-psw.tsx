// src/app/(auth)/reset-password/reset-psw.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { ResetPsw } from "@/lib/reset-psw";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PulseLoader from "@/components/pulse-loader";

const OTP_LENGTH = 6;

export default function ResetPassword() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const focusInput = (index: number) => inputsRef.current[index]?.focus();

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) focusInput(index - 1);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasteData) return;
    const next = Array(OTP_LENGTH).fill('');
    pasteData.split('').forEach((char, i) => (next[i] = char));
    setOtp(next);
    focusInput(Math.min(pasteData.length, OTP_LENGTH - 1));
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) return toast.error('Enter the full OTP');
    if (!newPassword) return toast.error('Enter your new password');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    const email = localStorage.getItem('reset_email');
    if (!email) {
      toast.error('Session expired. Please start over.');
      router.push('/forgot-password');
      return;
    }

    try {
      setLoading(true);
      await ResetPsw(email, otpString, newPassword);
      localStorage.removeItem('reset_email');
      toast.success('Password reset successful');
      router.push('/login');
    } catch {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(30);
    toast.success('OTP resent');
    // call ForgotPsw again here if needed
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen sec-ff">
      <div className="flex flex-col items-center gap-6 max-w-md w-full p-4 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit code sent to your email and your new password.
          </p>
        </div>

        <div className="flex gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { if (el) inputsRef.current[i] = el; }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              inputMode="numeric"
              maxLength={1}
              className="w-14 h-14 rounded-full border border-[var(--sec-clr)] bg-[var(--txt-clr)] text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] transition"
            />
          ))}
        </div>

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-4 py-2 border border-[var(--acc-clr)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] text-[var(--pry-clr)] placeholder:text-white/70"
        />

        <div className="text-center text-sm">
          {timer > 0 ? (
            <p className="text-gray-600">
              Resend code in <span className="font-semibold text-[var(--pry-clr)]">{formatTime(timer)}</span>
            </p>
          ) : (
            <button onClick={handleResend} className="text-[var(--pry-clr)] font-semibold hover:underline">
              Resend code
            </button>
          )}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full px-6 py-3 bg-[var(--acc-clr)] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <PulseLoader /> : 'Reset Password'}
        </button>
      </div>
    </div>
  );
}