'use client';

import { useState, useRef, useEffect } from 'react';
import { ResetPsw } from "@/lib/reset-psw";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // or your toast library

const OTP_LENGTH = 6;

export default function OTPInputUI() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const focusInput = (index: number) => {
    inputsRef.current[index]?.focus();
  };

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

  const verifyOtp = async () => {
    if (otp.join("").length !== OTP_LENGTH) return toast.error("Invalid OTP");
    
    try {
      // Assuming email and password are passed as props or retrieved from context/store
      const email = ""; // Get this from your form/context
      const pwd = ""; // Get this from your form/context
      
      await ResetPsw(email, otp.join(""), pwd);
      toast.success("Password reset");
      router.push("/login");
    } catch {
      toast.error("Failed");
    }
  };

  const handleResend = () => {
    setTimer(30);
    toast.success("OTP resent");
    // Add your resend OTP logic here
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen sec-ff">
      <div className="flex flex-col items-center gap-6 max-w-md w-full p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Enter Verification Code</h1>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit code that we have sent via the email
          </p>
        </div>

        <div className='flex gap-3'>
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
              className="w-14 h-14 rounded-full border-1 border-[var(--sec-clr)] bg-[var(--txt-clr)] text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)] transition"
            />
          ))}
        </div>

        <div className="text-center text-sm">
          {timer > 0 ? (
            <p className="text-gray-600">
              Resend code in <span className="font-semibold text-[var(--pry-clr)]">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-[var(--pry-clr)] font-semibold hover:underline"
            >
              Resend code
            </button>
          )}
        </div>

        <button
          onClick={verifyOtp}
          className="w-full px-6 py-3 bg-[var(--acc-clr)] text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Verify Code
        </button>
      </div>
    </div>
  );
}