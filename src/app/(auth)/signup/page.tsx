// src/app/(auth)/signup/page.tsx

import type { Metadata } from "next";
import SignupComp from "./sign-up";

export const metadata: Metadata = {
    title: 'Signup for an account',
};

export default function SignUpPage() {
    return (
        <main>
            <SignupComp />
        </main>
    )
}