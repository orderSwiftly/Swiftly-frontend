// utils/logout.ts
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/stores/userStore';
import OneSignal from 'react-onesignal';

export default function useLogout() {
  const router = useRouter();
  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token');

      // Call backend logout
      const res = await fetch(`${api_url}/api/v1/auth/user/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      // Unlink device from OneSignal
      if (typeof window !== 'undefined') {
        try {
          await OneSignal.logout();
        } catch (err) {
          console.error('OneSignal logout error:', err);
        }
      }

      // Clear local state
      localStorage.removeItem('token');
      clearUser();

      if (res.ok) {
        toast.success(data.message ?? 'Logged out successfully!');
      } else {
        toast.error(data.message ?? 'Logout failed.');
      }

      router.push('/login');
    } catch (error) {
      // Even if server logout fails, clear local data
      localStorage.removeItem('token');
      clearUser();

      toast.success('Logged out successfully!');
      router.push('/login');

      console.error('Logout error:', error);
    }
  };

  return handleLogout;
}