'use client';

import { useEffect } from 'react';
import useUserStore from '@/stores/useUserStore';
import toast from 'react-hot-toast';

export default function AuthProvider() {
  const { user, setUser, setHasHydrated } = useUserStore();

  useEffect(() => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    if (!api_url || user) {
      setHasHydrated(true);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${api_url}/api/v1/user/me`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        if (res.ok && data.status === 'success') {
          setUser(data.data.user);
        }
      } catch (err) {
        console.error('AuthProvider: Failed to fetch user', err);
        toast.error('Session expired. Please log in again.');
      } finally {
        setHasHydrated(true);
      }
    };

    fetchUser();
  }, [user, setUser, setHasHydrated]);

  return null;
}