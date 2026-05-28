// src/app/(auth)/login/login.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { loginUser } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = useUserStore();

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { token, user } = await loginUser({ email, password });

    localStorage.setItem('token', token);
    setUser(user, token);

    router.push('/role-gate');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--sec-clr)] py-4">
      <div className="w-full max-w-md mx-4 relative">
        {/* Form Card with built-in wave top */}
        <div className="bg-[var(--txt-clr)] rounded-2xl shadow-2xl overflow-hidden relative w-full">
          {/* Wave SVG as part of the card - DRAMATICALLY INCREASED HEIGHT */}
          <div className="w-full relative">
            <svg
              className="w-full h-auto"
              height="400"
              viewBox="0 0 1440 500"
              preserveAspectRatio="none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back layer - much taller wave */}
              <path
                d="M0 0 L1440 0 L1440 280 C1200 130, 960 230, 720 170 C480 110, 240 200, 0 100 Z"
                fill="var(--wave-clr)"
              />
              {/* Front layer - much taller wave */}
              <path
                d="M0 0 L1440 0 L1440 190 C1200 90, 960 160, 720 110 C480 60, 240 140, 0 70 Z"
                fill="var(--prof-clr)"
              />
            </svg>
          </div>
          
          {/* Content */}
          <div className="p-8 sm:p-10 space-y-7 -mt-20">

            <h1 className="text-xl sm:text-2xl font-bold text-left pry-ff text-[var(--pry-clr)]">Welcome back</h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-6 sec-ff">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-[var(--pry-clr)]">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={inputBase}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm text-[var(--pry-clr)]">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    placeholder="*******"
                    className={inputBase}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-3 flex items-center text-[var(--pry-clr)] cursor-pointer"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="text-sm text-right">
                <a href="/forgot-password" className="hover:underline text-[var(--acc-clr)] font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center bg-[var(--prof-clr)] text-[var(--txt-clr)] py-3.5 rounded-lg hover:bg-[var(--wave-clr)] transition font-semibold cursor-pointer h-[48px] text-base"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
              </button>
            </form>

            <p className="text-sm text-center text-[var(--pry-clr)] sec-ff pt-2">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[var(--acc-clr)] font-medium underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}