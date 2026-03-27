// src/app/(auth)/signup/sign-up.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { signupUser } from '@/lib/auth';

type Campus = {
  id: number;
  name: string;
  location: string;
};

export default function SignupComp() {
  const router = useRouter();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campus, setCampus] = useState<Campus | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    const storedCampus = localStorage.getItem('selected-campus');
    if (storedCampus) {
      setCampus(JSON.parse(storedCampus));
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
      await signupUser({ fullname, email, password });

      toast.success('Signup successful! Redirecting to login...');
      setLoading(false);
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
      setLoading(false);
    }
  };

  const inputBase =
    'w-full p-3 rounded-md text-[var(--pry-clr)] ' +
    'placeholder:text-[var(--sec-clr)] outline-none ' +
    'border border-[var(--acc-clr)] ' +
    'focus:border-[var(--acc-clr)] focus:ring-1 focus:ring-[var(--acc-clr)]';

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--sec-clr)] px-4">
      <div className="w-full max-w-md bg-[var(--txt-clr)] p-8 rounded-2xl shadow-lg text-[var(--pry-clr)]">
        <div className='flex flex-col items-center'>
          <Image src="/swiftly.png" alt="Swiftly Logo" width={100} height={100} />
          <h1 className="text-xl font-bold text-center mb-4 pry-ff">
            Register with Swiftly
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sec-ff">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm mb-1 block">Full name</label>
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
              <label className="text-sm mb-1 block">Email</label>
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
            <label className="text-sm mb-1 block">Password</label>
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
            <label className="text-sm mb-1 block">Confirm Password</label>
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

          <div className="group cursor-pointer flex items-center justify-between gap-3 border border-dashed border-[var(--sec-clr)] rounded-lg p-3 bg-[var(--sec-clr)] transition">
            <div className="flex flex-col gap-1">
              {campus ? (
                <p className="pry-ff text-sm">{campus.name}</p>
              ) : (
                <p className="text-sm opacity-70 sec-ff">Select your campus</p>
              )}
            </div>
            <GraduationCap
              size={20}
              className="text-[var(--acc-clr)] group-hover:scale-110 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="cursor-pointer accent-[var(--acc-clr)]"
            />
            <label htmlFor="terms" className="text-sm sec-ff">
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

        <p className="text-sm text-center m-3 text-[var(--pry-clr)] sec-ff">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-[var(--acc-clr)] underline font-medium cursor-pointer"
          >
            Login here
          </button>
        </p>
      </div>
    </main>
  );
}