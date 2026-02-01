// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/role-gate'); // go to the role gate
}