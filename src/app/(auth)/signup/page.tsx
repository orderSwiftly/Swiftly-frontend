'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, GraduationCap, ChevronRight } from 'lucide-react';
import PulseLoader from '@/components/pulse-loader';
import toast from 'react-hot-toast';
import Link from 'next/link';

type Campus = {
    id: number;
    name: string;
    location: string;
};

const TERMS_KEY = 'swiftly-terms-accepted';

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
    const [termsAccepted, setTermsAccepted] = useState(false);

    const api_url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const storedCampus = localStorage.getItem('selected-campus');
        if (storedCampus) setCampus(JSON.parse(storedCampus));
        setTermsAccepted(localStorage.getItem(TERMS_KEY) === 'true');
    }, []);

    const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setTermsAccepted(checked);
        checked
            ? localStorage.setItem(TERMS_KEY, 'true')
            : localStorage.removeItem(TERMS_KEY);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${api_url}/api/v1/auth/user/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullname, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.message ?? 'Something went wrong');
            toast.success('Signup successful! Redirecting to login...');
            router.push('/login');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        'w-full p-2.5 rounded-md text-sm text-[var(--pry-clr)] ' +
        'placeholder:text-[var(--pry-clr)] placeholder:opacity-40 outline-none ' +
        'border border-[var(--acc-clr)] ' +
        'focus:border-[var(--acc-clr)] focus:ring-1 focus:ring-[var(--acc-clr)] transition';

    return (
        <main className="min-h-screen flex items-center justify-center bg-[var(--sec-clr)] px-4">
            <div className="w-full max-w-sm bg-[var(--txt-clr)] p-6 rounded-2xl shadow-lg text-[var(--pry-clr)]">

                <h1 className="text-2xl font-bold text-center mb-5 pry-ff">
                    Register with Swiftly
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sec-ff">

                    {/* Full name + Email side by side */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs mb-1 block opacity-60">Full name</label>
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
                            <label className="text-xs mb-1 block opacity-60">Email</label>
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

                    {/* Password + Confirm side by side */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs mb-1 block opacity-60">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Create"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`${inputBase} pr-8`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--pry-clr)] opacity-40 hover:opacity-80 transition cursor-pointer"
                                >
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs mb-1 block opacity-60">Confirm</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPass ? 'text' : 'password'}
                                    placeholder="Repeat"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`${inputBase} pr-8 ${confirmPassword && password !== confirmPassword
                                            ? '!border-red-400 !ring-red-400'
                                            : ''
                                        }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--pry-clr)] opacity-40 hover:opacity-80 transition cursor-pointer"
                                >
                                    {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mismatch hint */}
                    {confirmPassword && password !== confirmPassword && (
                        <p className="text-red-400 text-xs -mt-1">Passwords do not match</p>
                    )}

                    {/* Campus selector */}
                    <div className="flex items-center justify-between gap-3 border border-dashed border-[var(--acc-clr)] rounded-lg p-2.5 bg-[var(--sec-clr)] transition">
                        <div className="flex items-center gap-2">
                            <GraduationCap size={16} className="text-[var(--acc-clr)] flex-shrink-0" />
                            {campus ? (
                                <p className="pry-ff text-sm">{campus.name}</p>
                            ) : (
                                <p className="text-sm opacity-40 sec-ff">Select your campus</p>
                            )}
                        </div>
                        <ChevronRight size={14} className="opacity-30 flex-shrink-0" />
                    </div>

                    {/* Terms */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={handleTermsChange}
                            className="w-4 h-4 accent-[var(--acc-clr)] cursor-pointer flex-shrink-0"
                        />
                        <span className="text-xs sec-ff opacity-60 leading-snug">
                            I agree to the{' '}
                            <Link
                                href="/terms"
                                className="text-[var(--acc-clr)] underline opacity-100"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Terms &amp; Privacy Policy
                            </Link>
                        </span>
                    </label>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !termsAccepted}
                        className={`flex items-center justify-center bg-[var(--acc-clr)] text-[var(--pry-clr)] py-2.5 rounded-lg font-semibold text-sm h-10 transition
              ${termsAccepted ? 'cursor-pointer hover:opacity-90' : 'opacity-40 cursor-not-allowed'}`}
                    >
                        {loading ? <PulseLoader /> : 'Sign Up'}
                    </button>
                </form>

                <p className="text-xs text-center mt-4 sec-ff opacity-60">
                    Already have an account?{' '}
                    <button
                        onClick={() => router.push('/login')}
                        className="text-[var(--acc-clr)] underline opacity-100 font-medium cursor-pointer"
                    >
                        Login here
                    </button>
                </p>
            </div>
        </main>
    );
}