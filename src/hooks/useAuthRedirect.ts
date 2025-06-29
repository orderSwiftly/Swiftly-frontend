'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useUserStore from '@/stores/useUserStore';

export default function useAuthRedirect() {
  const router = useRouter();
  const { user, hasHydrated } = useUserStore();

  useEffect(() => {
    if (!hasHydrated) return; // Wait for hydration

    if (!user) {
      router.push('/signup');
    }
  }, [user, hasHydrated, router]);
}