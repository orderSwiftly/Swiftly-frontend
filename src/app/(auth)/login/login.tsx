'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-clr)] px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl text-[var(--txt-clr)] space-y-6">
        
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/tredia.png"
            alt="Tredia Logo"
            width={80}
            height={80}
            className="rounded-full"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center pry-ff">
          Welcome Back to Tredia
        </h1>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5 sec-ff">
          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-white/80">
              Email
            </label>
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

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-white/80">
              Password
            </label>
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
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-sm text-right text-white/70">
            <a
              href="/forgot-password"
              className="hover:underline text-[var(--acc-clr)] font-medium"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-[var(--acc-clr)] hover:bg-opacity-90 transition text-[var(--txt-clr)] py-3 rounded-md font-medium"
          >
            Log In
          </button>
        </form>

        {/* Switch to Sign Up */}
        <p className="text-sm text-center text-white/70 sec-ff">
          Don’t have an account?{' '}
          <a
            href="/signup"
            className="text-[var(--acc-clr)] font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}