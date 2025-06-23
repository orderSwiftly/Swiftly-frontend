'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

export default function SignupComp() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleGoogleSignup = () => {
    alert('Redirecting to Google auth...');
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signing up with:', { email, password });
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-clr)] px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg text-[var(--txt-clr)]">
        <h1 className="text-3xl font-bold text-center mb-6 pry-ff">
          {showEmailForm ? 'Create your account' : 'Register with Tredia'}
        </h1>

        {showEmailForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-[var(--txt-clr)] sec-ff">
            {/* Email Input */}
            <div>
              <label className="text-sm mb-1 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 p-3 rounded-md text-[var(--txt-clr)] placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
                required
              />
            </div>

            {/* Password Input with Eye Icon */}
            <div>
              <label className="text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 p-3 rounded-md text-[var(--txt-clr)] placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)] pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-[var(--acc-clr)] text-[var(--txt-clr)] py-3 rounded-lg hover:bg-opacity-90 transition font-medium"
            >
              Sign Up
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 text-[var(--txt-clr)] sec-ff">
            <button
              onClick={() => setShowEmailForm(true)}
              className="flex items-center justify-start gap-3 bg-white/10 py-2 px-4 rounded-lg focus:ring-2 ring-[var(--acc-clr)] transition"
            >
              <Mail size={20} />
              Sign up with Email
            </button>

            <button
              onClick={handleGoogleSignup}
              className="flex items-center justify-start gap-3 bg-white/10 py-2 px-4 rounded-lg focus:ring-2 ring-[var(--acc-clr)] transition"
            >
              <FcGoogle size={20} />
              Sign up with Google
            </button>
          </div>
        )}

        <p className="text-sm text-center mt-6 text-white/80 sec-ff">
          Already have an account?{' '}
          <button
            onClick={handleLoginRedirect}
            className="text-[var(--acc-clr)] hover:underline font-medium cursor-pointer"
          >
            Log in
          </button>
        </p>
      </div>
    </main>
  );
}