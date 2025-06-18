'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-clr)] text-[var(--txt-clr)] pry-ff text-center px-4">
      <AlertTriangle className="text-yellow-400 w-16 h-16 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        Oops, the page you are looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-blue-950 transition px-6 py-2 rounded-md text-white font-medium"
      >
        Go to Home
      </Link>
    </div>
  );
}
