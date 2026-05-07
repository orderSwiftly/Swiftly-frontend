// src/app/(auth)/signup/sign-up.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { signupUser } from '@/lib/auth';
import WelcomeScreen from '@/components/welcome-screen';
import Onboarding from '@/components/onboarding';

export default function SignupComp() {
  const router = useRouter();

  const [step, setStep] = useState<'welcome' | 'onboarding' | 'form' | null>(null);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const seenWelcome = sessionStorage.getItem('seen-welcome');
    const seenOnboarding = localStorage.getItem('seen-onboarding');

    if (!seenWelcome) {
      setStep('welcome');
    } else if (!seenOnboarding) {
      setStep('onboarding');
    } else {
      setStep('form');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await signupUser({ fullname, email, phone, password });
      toast.success('Signup successful! Redirecting to login...');
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full p-3 rounded-md text-[var(--pry-clr)] ' +
    'placeholder:text-[var(--sec-clr)] outline-none ' +
    'border border-[var(--acc-clr)] ' +
    'focus:border-[var(--acc-clr)] focus:ring-1 focus:ring-[var(--acc-clr)]';

  if (step === 'welcome') {
    return (
      <WelcomeScreen
        onFinish={() => {
          sessionStorage.setItem('seen-welcome', 'true');
          setStep('onboarding');
        }}
      />
    );
  }

  if (step === 'onboarding') {
    return (
      <Onboarding
        onFinish={() => {
          localStorage.setItem('seen-onboarding', 'true');
          setStep('form');
        }}
      />
    );
  }

  if (step !== 'form') return null;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--sec-clr)] py-4">
      <div className="w-full max-w-md mx-4 relative">
        {/* Form Card with built-in wave top */}
        <div className="bg-[var(--txt-clr)] rounded-2xl shadow-2xl overflow-hidden relative w-full">
          {/* Wave SVG as part of the card - TRULY INCREASED HEIGHT */}
          <div className="w-full relative">
            <svg
              className="w-full h-auto"
              height="200"
              viewBox="0 0 1440 270"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back layer - much taller */}
              <path
                d="M0 0 L1440 0 L1440 200 C1200 95, 960 160, 720 120 C480 80, 240 140, 0 70 Z"
                fill="var(--wave-clr)"
              />
              {/* Front layer - much taller */}
              <path
                d="M0 0 L1440 0 L1440 140 C1200 65, 960 110, 720 80 C480 50, 240 95, 0 45 Z"
                fill="var(--prof-clr)"
              />
            </svg>
          </div>
          
          {/* Content */}
          <div className="p-6 sm:p-8 space-y-5 -mt-10">
            <div className='flex flex-col items-center'>
              <h1 className="text-xl font-bold text-center mb-2 pry-ff text-[var(--pry-clr)]">
                Register with Swiftly
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sec-ff">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm mb-1 block text-[var(--pry-clr)]">Full name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className={inputBase}
                    required
                  />
                </div>

                <div className="flex-1">
                  <label className="text-sm mb-1 block text-[var(--pry-clr)]">Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputBase}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm mb-1 block text-[var(--pry-clr)]">Phone number</label>
                <input
                  type="tel"
                  placeholder="08012345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputBase}
                  required
                />
              </div>

              <div>
                <label className="text-sm mb-1 block text-[var(--pry-clr)]">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputBase} pr-10`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pry-clr)] cursor-pointer"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm mb-1 block text-[var(--pry-clr)]">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputBase} pr-10 ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-red-500 focus:ring-red-500'
                        : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--pry-clr)] cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="cursor-pointer accent-[var(--acc-clr)]"
                />
                <label htmlFor="terms" className="text-sm sec-ff text-[var(--pry-clr)]">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[var(--acc-clr)] underline font-medium">
                    Terms & Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !agreedToTerms}
                className="flex items-center justify-center bg-[var(--acc-clr)] text-[var(--pry-clr)] py-3 rounded-lg font-semibold h-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <PulseLoader /> : 'Sign Up'}
              </button>
            </form>

            <p className="text-sm text-center text-[var(--pry-clr)] sec-ff">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-[var(--acc-clr)] underline font-medium cursor-pointer"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}