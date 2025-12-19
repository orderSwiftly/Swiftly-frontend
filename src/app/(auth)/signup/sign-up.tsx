'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { GraduationCap } from 'lucide-react';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';

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
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campus, setCampus] = useState<Campus | null>(null);

  const api_url = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const storedCampus = localStorage.getItem('selected-campus');
    if (storedCampus) {
      setCampus(JSON.parse(storedCampus));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${api_url}/api/v1/auth/user/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message ?? 'Something went wrong');
      }

      toast.success('Signup successful! Redirecting to login...');
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast('Redirecting to social auth...');
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const inputBase =
    'w-full p-3 rounded-md text-[var(--pry-clr)] ' +
    'placeholder:text-[var(--sec-clr)] outline-none ' +
    'border border-[var(--acc-clr)] ' +
    'focus:border-[var(--acc-clr)] focus:ring-1 focus:ring-[var(--acc-clr)]';

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--sec-clr)] px-4">
      <div className="w-full max-w-md bg-[var(--txt-clr)] p-8 rounded-2xl shadow-lg text-[var(--pry-clr)]">
        <h1 className="text-3xl font-bold text-center mb-6 pry-ff">
          Register with Swiftly
        </h1>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sec-ff">
          <div>
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

          <div>
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

          <div
  className="
    group cursor-pointer flex items-center justify-between gap-3
    border border-dashed border-[var(--sec-clr)]
    rounded-lg p-3
    bg-[var(--sec-clr)]
    transition
  "
>
  <div className="flex flex-col gap-1">
    {campus ? (
        <p className="pry-ff text-sm">
          {campus.name}
        </p>
    ) : (
      <p className="text-sm opacity-70 sec-ff">
        Select your campus
      </p>
    )}
  </div>

  <GraduationCap
    size={20}
    className="text-[var(--acc-clr)] group-hover:scale-110 transition"
  />
</div>



          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center bg-[var(--acc-clr)] text-[var(--pry-clr)] py-3 rounded-lg font-semibold h-[44px] cursor-pointer"
          >
            {loading ? <PulseLoader /> : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-sm text-center m-3 text-[var(--pry-clr)] sec-ff">
          Already have an account?{' '}
          <button
            onClick={handleLoginRedirect}
            className="text-[var(--acc-clr)] underline font-medium"
          >
            Login here
          </button>
        </p>
        <p className="text-sm text-center m-3 text-[var(--acc-clr)] sec-ff underline">
          I agree to Terms & Privacy Policy
        </p>

        {/* SOCIAL BUTTONS */}
        <div className="flex gap-3 sec-ff">
          <button
            onClick={handleGoogleSignup}
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--sec-clr)] text-[var(--pry-clr)] py-2.5 rounded-lg font-medium text-xs cursor-pointer"
          >
            <FcGoogle size={20} />
            Sign up with Google
          </button>

          <button
            onClick={handleGoogleSignup}
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--pry-clr)] text-[var(--txt-clr)] py-2.5 rounded-lg font-medium cursor-pointer text-xs"
          >
            <FaApple size={18} />
            Sign up with Apple
          </button>
        </div>

        
      </div>
    </main>
  );
}