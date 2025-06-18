'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bug } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-clr)] text-[var(--txt-clr)] pry-ff text-center px-4">
      <Bug className="text-red-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        We are sorry for the inconvenience. Please try refreshing or go back home.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-5 py-2 bg-[var(--acc-clr)] hover:bg-[var(--bg-clr)] transition rounded-md"
        >
          Try Again
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 bg-blue-950 transition rounded-md"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
