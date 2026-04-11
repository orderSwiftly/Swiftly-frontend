import type { Metadata } from 'next';
import LoginComp from './login';

export const metadata: Metadata = {
    title: 'Login to your account',
};

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--sec-clr)]">
            <LoginComp />
        </main>
    )
}