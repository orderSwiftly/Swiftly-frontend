// hooks/useAuthRedirect.ts
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useUserStore from '@/stores/useUserStore';

export default function useAuthRedirect() {
  const router = useRouter();
  const { user, hasHydrated, isAuthChecked } = useUserStore();

  useEffect(() => {
    if (!hasHydrated || !isAuthChecked) return;

    if (user === null) {
      router.push('/login');
    }
  }, [user, hasHydrated, isAuthChecked, router]);
}