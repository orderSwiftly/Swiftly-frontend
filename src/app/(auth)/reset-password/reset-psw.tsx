'use client';

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { ResetPsw } from "@/lib/reset-psw";
import { useRouter } from "next/navigation";

const OTP_LENGTH = 6;

export default function ResetPassword() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [pwd, setPwd] = useState<string>("");

  // Typed refs correctly
  const refs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();

  const move = (i: number, forward = true) => {
    const next = forward ? i + 1 : i - 1;
    const target = refs.current[next];
    if (target) target.focus();
  };

  const handleOtp = (v: string, i: number) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const arr = [...otp];
    arr[i] = d;
    setOtp(arr);

    if (d && i < OTP_LENGTH - 1) move(i);
  };

  // Proper typing for submit events
  const submitEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return toast.error("Enter email");
    toast.success("OTP sent");
    setStep(2);
  };

  const verifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.join("").length !== OTP_LENGTH) return toast.error("Invalid OTP");
    setStep(3);
  };

  const reset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await ResetPsw(email, otp.join(""), pwd);
      toast.success("Password reset");
      router.push("/login");
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-6 bg-[var(--light-bg)] pry-ff">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow">

        {step === 1 && (
          <form onSubmit={submitEmail} className="flex flex-col gap-4">
            <h2 className="text-lg pry-ff text-[var(--txt-clr)]">Reset Password</h2>

            <input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded border bg-white/10 text-[var(--txt-clr)]"
            />

            <button className="py-2 bg-[var(--acc-clr)] rounded text-[var(--bg-clr)]">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp} className="flex flex-col gap-4">
            <p className="text-sm sec-ff text-[var(--acc-clr)]">Enter OTP</p>

            <div className="flex justify-center gap-2">
              {otp.map((v, i) => (
                <input
                  required
                  key={i}
                  ref={(el) => {
                    if (el) refs.current[i] = el;
                  }}
                  value={v}
                  maxLength={1}
                  inputMode="numeric"
                  onChange={(e) => handleOtp(e.target.value, i)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0) move(i, false);
                  }}
                  className="w-10 h-12 text-center rounded border bg-white/10 text-[var(--txt-clr)]"
                />
              ))}
            </div>

            <button className="py-2 bg-[var(--acc-clr)] rounded text-[var(--bg-clr)]">
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={reset} className="flex flex-col gap-4">
            <p className="text-sm sec-ff text-[var(--acc-clr)]">Enter New Password</p>

            <input
              type="password"
              placeholder="New password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="p-2 rounded border bg-white/10 text-[var(--txt-clr)]"
            />

            <button className="py-2 bg-[var(--acc-clr)] rounded text-[var(--bg-clr)]">
              Reset Password
            </button>
          </form>
        )}

      </div>
    </main>
  );
}