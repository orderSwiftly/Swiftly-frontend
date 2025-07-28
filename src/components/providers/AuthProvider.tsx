'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { fetchUser, user } = useUserStore();
  const [hasHydrated, setHasHydrated] = useState(false);

  // Wait for Zustand hydration before doing anything
  useEffect(() => {
    const rehydrate = async () => {
      await useUserStore.persist.rehydrate();
      setHasHydrated(true);
    };

    rehydrate();
  }, []);

  // After hydration, check if token exists and user is not yet fetched
  useEffect(() => {
    if (!hasHydrated) return;

    const token = localStorage.getItem('token');
    if (token && !user) {
      fetchUser();
    }
  }, [hasHydrated, user, fetchUser]);

  return <>{children}</>;
}
