'use client';

import { useState, useRef, useEffect } from 'react';
import { resetPsw, forgotPassword } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import PulseLoader from "@/components/pulse-loader";
import { Eye, EyeOff, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

const OTP_LENGTH = 6;
const COUNTDOWN_MINUTES = 10;
const COUNTDOWN_SECONDS = COUNTDOWN_MINUTES * 60;

type Step = 'otp' | 'password';

export default function ResetPassword() {
  const [step, setStep] = useState<Step>('otp');
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center sec-ff p-3 md:p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Card Container - Optimized for mobile */}
        <div className="bg-[var(--txt-clr)] rounded-2xl shadow-lg overflow-hidden">
          {/* Header with better spacing for mobile */}
          <div className="px-5 pt-8 pb-4 md:px-8 md:pt-10 md:pb-6 text-center border-b border-gray-100">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-[var(--prof-clr)]">
              Reset Password
            </h1>
            <p className="text-gray-500 text-xs md:text-sm">
              {step === 'otp' 
                ? 'Enter the 6-digit code sent to your email' 
                : 'Create your new password'}
            </p>
          </div>

          {/* Content */}
          <div className="p-5 md:p-8">
            {/* Step 1: OTP Input */}
            {step === 'otp' && (
              <>
                

                {/* OTP Inputs - Responsive grid for mobile */}
                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
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
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl border-2 border-gray-200 bg-white text-center text-lg md:text-xl font-bold focus:outline-none focus:border-[var(--acc-clr)] focus:ring-2 focus:ring-[var(--acc-clr)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                    />
                  ))}
                </div>

                {/* Resend Section - Mobile friendly */}
                <div className="text-center mb-6">
                  {isExpired ? (
                    <button
                      onClick={handleResend}
                      disabled={loading}
                      className="inline-flex items-center gap-2 text-[var(--pry-clr)] font-semibold hover:underline disabled:opacity-50 text-sm md:text-base"
                    >
                      <RefreshCw size={14} className="md:w-4 md:h-4" />
                      {loading ? <PulseLoader /> : 'Request New OTP'}
                    </button>
                  ) : (
                    <p className="text-gray-500 text-xs md:text-sm">
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

                {/* Timer Display - Responsive */}
                <div className="flex justify-center mb-6">
                  <div className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold ${
                    isExpired 
                      ? 'text-red-600' 
                      : timer <= 60 
                        ? 'text-orange-600 animate-pulse' 
                        : 'text-gray-500'
                  }`}>
                    {isExpired ? (
                      <span>Session Expired</span>
                    ) : (
                      <span>Expires in: {formatTime(timer)}</span>
                    )}
                  </div>
                </div>

                {/* Next Button - Touch friendly */}
                <button
                  onClick={handleNext}
                  disabled={isExpired || loading}
                  className="w-full px-6 py-3 md:py-3.5 bg-[var(--acc-clr)] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base shadow-md active:scale-98"
                >
                  {loading ? <PulseLoader /> : (
                    <>
                      Next <ArrowRight size={16} className="md:w-5 md:h-5" />
                    </>
                  )}
                </button>
              </>
            )}

            {/* Step 2: Password Input */}
            {step === 'password' && (
              <>
                {/* Password Fields - Mobile optimized */}
                <div className="space-y-4 mb-6">
                  {/* New Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min. 6 characters)"
                        className="w-full px-4 py-3 md:py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--acc-clr)] focus:ring-2 focus:ring-[var(--acc-clr)] transition text-sm md:text-base pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                      Password must be at least 6 characters
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className="w-full px-4 py-3 md:py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--acc-clr)] focus:ring-2 focus:ring-[var(--acc-clr)] transition text-sm md:text-base pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons - Stack on mobile, side by side on tablet+ */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleBack}
                    disabled={loading}
                    className="order-2 sm:order-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 cursor-pointer text-sm md:text-base active:scale-98 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} className="md:w-5 md:h-5" />
                    Back
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="order-1 sm:order-2 px-6 py-3 bg-[var(--acc-clr)] text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base shadow-md active:scale-98"
                  >
                    {loading ? <PulseLoader /> : (
                      <>
                        Reset Password <ArrowRight size={16} className="md:w-5 md:h-5" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Helper Text - Only visible on mobile */}
        <p className="text-center text-xs text-gray-400 mt-4 md:hidden">
          Secure password reset
        </p>
      </div>
    </div>
  );
}