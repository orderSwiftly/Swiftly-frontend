// src/app/(auth)/login/login.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || data.status !== 'success') {
      throw new Error(data.message || 'Login failed');
    }

    // Save token and sync Zustand
    localStorage.setItem('token', data.data.user.token);
    setUser(data.data.user); // 👈 instant state update

    // Redirect
    setTimeout(() => {
      router.push('/role-gate'); // go to role gate for role-based routing
    }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';
    toast.error(message);
  } finally {
    setLoading(false);
  }
  };
  
  const handleGoogleSignin = () => {
    toast('Redirecting to social auth...');
  };

  const inputBase =
    'w-full p-3 rounded-md text-[var(--pry-clr)] ' +
    'placeholder:text-[var(--sec-clr)] outline-none ' +
    'border border-[var(--acc-clr)] ' +
    'focus:border-[var(--acc-clr)] focus:ring-1 focus:ring-[var(--acc-clr)]';


  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--sec-clr)] px-4">
      <div className="w-full max-w-md bg-[var(--txt-clr)] p-8 sm:p-10 rounded-2xl shadow-2xl text-[var(--txt-clr)] space-y-4">
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Image src="/swiftly.png" alt="Swiftly Logo" width={80} height={80} className="rounded-full" priority />
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-center pry-ff text-black">Welcome Back to Swiftly</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 sec-ff">
          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
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

          <div className="text-sm text-right text-white/70">
            <a href="/forgot-password" className="hover:underline text-[var(--acc-clr)] font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center bg-[var(--acc-clr)] text-[var(--pry-clr)] py-3 rounded-lg hover:bg-opacity-90 transition font-semibold cursor-pointer h-[44px]"
            disabled={loading}
          >
            {loading ? <PulseLoader /> : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-center text-[var(--pry-clr)] sec-ff">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-[var(--acc-clr)] font-medium underline">
            Sign up
          </a>
        </p>

        {/* SOCIAL BUTTONS */}
              <div className="flex gap-3 sec-ff">
                <button
                  onClick={handleGoogleSignin}
                  className="flex-1 flex items-center justify-center gap-2 bg-[var(--sec-clr)] text-[var(--pry-clr)] py-2.5 rounded-lg font-medium text-xs cursor-pointer"
                >
                  <FcGoogle size={20} />
                  Sign in with Google
                </button>
      
                <button
                  onClick={handleGoogleSignin}
                  className="flex-1 flex items-center justify-center gap-2 bg-[var(--pry-clr)] text-[var(--txt-clr)] py-2.5 rounded-lg font-medium cursor-pointer text-xs"
                >
                  <FaApple size={18} />
                  Sign in with Apple
                </button>
              </div>
      </div>

      
    </main>
  );
}