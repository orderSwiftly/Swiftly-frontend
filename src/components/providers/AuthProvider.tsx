// components/providers/AuthProvider.tsx
'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { fetchUser, isAuthenticated } = useUserStore();

  useEffect(() => {
    // Only fetch user if not already authenticated
    if (!isAuthenticated) {
      fetchUser();
    }
  }, [fetchUser, isAuthenticated]);

  return <>{children}</>;
}