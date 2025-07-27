'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

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
      
      // Store token first
      localStorage.setItem('token', data.data.token);

      // Small delay to ensure everything is set
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-clr)] px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl text-[var(--txt-clr)] space-y-6">
        <div className="flex justify-center">
          <Image src="/tredia.png" alt="Tredia Logo" width={80} height={80} className="rounded-full" priority />
        </div>

        <h1 className="text-3xl font-bold text-center pry-ff">Welcome Back to Tredia</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 sec-ff">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-white/80">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-white/10 p-3 rounded-md text-[var(--txt-clr)] placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-white/80">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Your password"
                className="bg-white/10 p-3 rounded-md text-[var(--txt-clr)] placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)] w-full pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-[var(--txt-clr)]"
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
            className="flex items-center justify-center bg-[var(--acc-clr)] text-[var(--bg-clr)] py-3 rounded-lg hover:bg-opacity-90 transition font-semibold cursor-pointer h-[44px]"
            disabled={loading}
          >
            {loading ? <PulseLoader /> : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-center text-white/70 sec-ff">
          Don`t have an account?{' '}
          <a href="/signup" className="text-[var(--acc-clr)] font-medium hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}