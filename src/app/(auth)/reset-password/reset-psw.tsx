'use client';

import { useState, useRef, useEffect } from 'react';
import { resetPsw, forgotPassword } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PulseLoader from "@/components/pulse-loader";

const OTP_LENGTH = 6;
const COUNTDOWN_MINUTES = 10;
const COUNTDOWN_SECONDS = COUNTDOWN_MINUTES * 60;

type Step = 'otp' | 'password';

export default function ResetPassword() {
  const [step, setStep] = useState<Step>('otp');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(COUNTDOWN_SECONDS);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            toast.error('Session expired. Please request a new OTP.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const focusInput = (index: number) => inputsRef.current[index]?.focus();

  const handleOtpChange = (value: string, index: number) => {
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

  const handleNext = () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }
    
    // Move to password step
    setStep('password');
  };

  const handleBack = () => {
    setStep('otp');
  };

  const handleSubmit = async () => {
    if (!newPassword) {
      toast.error('Please enter your new password');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const email = localStorage.getItem('reset_email');
    if (!email) {
      toast.error('Session expired. Please start over.');
      router.push('/forgot-password');
      return;
    }

    if (timer === 0) {
      toast.error('Session expired. Please request a new OTP.');
      router.push('/forgot-password');
      return;
    }

    try {
      setLoading(true);
      await resetPsw({ 
        email: email, 
        otp: otp.join(''), 
        newPassword: newPassword 
      });
      localStorage.removeItem('reset_email');
      toast.success('Password reset successful! Please login with your new password.');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const email = localStorage.getItem('reset_email');
    if (!email) {
      toast.error('Session expired. Please start over.');
      router.push('/forgot-password');
      return;
    }
    
    try {
      setLoading(true);
      await forgotPassword(email);
      setTimer(COUNTDOWN_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(''));
      setStep('otp');
      toast.success('New OTP sent to your email');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired = timer === 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 sec-ff p-4">
      <div className="flex flex-col gap-6 max-w-md w-full p-6 md:p-8 bg-white rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--pry-clr)] mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 'otp' 
              ? 'Enter the 6-digit code sent to your email' 
              : 'Create your new password'}
          </p>
        </div>

        {/* Timer Display */}
        <div className="flex justify-center">
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            isExpired 
              ? 'bg-red-100 text-red-600' 
              : timer <= 60 
                ? 'bg-orange-100 text-orange-600 animate-pulse' 
                : 'bg-blue-100 text-blue-600'
          }`}>
            {isExpired ? 'Expired' : `Expires in: ${formatTime(timer)}`}
          </div>
        </div>

        {/* Step 1: OTP Input */}
        {step === 'otp' && (
          <>
            <div className="flex justify-center gap-2 md:gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { if (el) inputsRef.current[i] = el; }}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  inputMode="numeric"
                  maxLength={1}
                  disabled={isExpired}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-[var(--sec-clr)] bg-white text-center text-xl font-bold focus:outline-none focus:border-[var(--acc-clr)] focus:ring-2 focus:ring-[var(--acc-clr)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ))}
            </div>

            {/* Resend Button */}
            <div className="text-center">
              {isExpired ? (
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-[var(--pry-clr)] font-semibold hover:underline disabled:opacity-50"
                >
                  {loading ? <PulseLoader /> : 'Request New OTP'}
                </button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Didn&apos;t receive code?{' '}
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="text-[var(--pry-clr)] font-semibold hover:underline disabled:opacity-50"
                  >
                    Resend
                  </button>
                </p>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={isExpired || loading}
              className="w-full px-6 py-3 bg-[var(--acc-clr)] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Next →
            </button>
          </>
        )}

        {/* Step 2: Password Input */}
        {step === 'password' && (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                  className="w-full px-4 py-2 border border-[var(--sec-clr)] rounded-lg focus:outline-none focus:border-[var(--acc-clr)] focus:ring-2 focus:ring-[var(--acc-clr)] transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full px-4 py-2 border border-[var(--sec-clr)] rounded-lg focus:outline-none focus:border-[var(--acc-clr)] focus:ring-2 focus:ring-[var(--acc-clr)] transition"
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50 cursor-pointer"
              >
                ← Back
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[var(--acc-clr)] text-(--txt-clr) rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
              >
                {loading ? <PulseLoader /> : 'Reset Password'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}