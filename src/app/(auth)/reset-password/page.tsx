import type { Metadata } from "next";
import ResetPassword from "./reset-psw";

export const metadata: Metadata = {
    title: 'Reset password',
};

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen w-full bg-[var(--light-bg)] pt-[20px] flex flex-col px-2">
            <ResetPassword />
        </main>
    )
}