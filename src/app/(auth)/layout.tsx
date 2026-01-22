'use client';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="min-h-screen flex items-center justify-center bg-[var(--sec-clr)] px-4">
            {children}
        </main>
    );
}