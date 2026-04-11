import type { Metadata } from "next";
import ForgotPassword from "./forgot-psw";

export const metadata: Metadata = {
    title: 'Forgot password',
};

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen w-full bg-[var(--light-bg)] pt-[20px] flex flex-col px-2">
            <ForgotPassword />
        </main>
    )
}