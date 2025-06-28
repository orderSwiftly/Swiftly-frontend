'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';

export default function SignupComp() {
  const router = useRouter();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const api_url = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${api_url}/api/v1/auth/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? 'Something went wrong');
      }

      console.log('Signup successful:', data);
      toast.success('Signup successful! Redirecting to login...');
      router.push('/login'); // or show success message
    } catch (err) {
      console.error('Signup error', err);
      toast.error('Error signing up');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast('Redirecting to Google auth...');
    // You can plug in next-auth or Google OAuth here
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-clr)] px-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg text-[var(--txt-clr)]">
        <h1 className="text-3xl font-bold text-center mb-6 pry-ff">
          {showEmailForm ? 'Create your account' : 'Register with Tredia'}
        </h1>

        {showEmailForm ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-[var(--txt-clr)] sec-ff">
            {/* Fullname Input */}
            <div>
              <label className="text-sm mb-1 block">Full name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full bg-white/10 p-3 rounded-md text-[var(--txt-clr)] placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)]"
                required
              />
            </div>

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

            {/* Password Input with Toggle */}
            <div>
              <label className="text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 p-3 rounded-md text-[var(--txt-clr)] placeholder:text-white/70 outline-none focus:ring-2 ring-[var(--acc-clr)] pr-10 "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center bg-[var(--acc-clr)] text-[var(--bg-clr)] py-3 rounded-lg hover:bg-opacity-90 transition font-semibold cursor-pointer h-[44px]"
            >
              {loading ? <PulseLoader /> : 'Sign Up'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4 text-[var(--txt-clr)] sec-ff">
            <button
              onClick={() => setShowEmailForm(true)}
              className="flex items-center justify-start cursor-pointer gap-3 bg-white/10 py-2 px-4 rounded-lg focus:ring-2 ring-[var(--acc-clr)] transition"
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