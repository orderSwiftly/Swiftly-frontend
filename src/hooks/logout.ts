// utils/logout.ts
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useUserStore from '@/stores/useUserStore';

export default function useLogout() {
  const router = useRouter();
  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${api_url}/api/v1/auth/user/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        clearUser(); // ✅ resets user, hydration, and auth check
        toast.success(data.message ?? 'Logged out successfully!');
        router.push('/login');
      } else {
        toast.error(data.message ?? 'Logout failed.');
      }
    } catch (error) {
      toast.error('An error occurred during logout.');
      console.error('Logout error:', error);
    }
  };

  return handleLogout;
}