// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/dashboard'); // or '/buyer/dashboard' if you want full path
}