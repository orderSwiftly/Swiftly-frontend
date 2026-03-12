// src/hooks/logout.ts

'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/stores/userStore';

export default function useLogout() {
  const router = useRouter();
  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    localStorage.removeItem('token');
    clearUser();
    router.push('/login');
    toast.success('Logged out successfully!');

    const api_url = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${api_url}/api/v1/auth/user/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).catch((err) => console.error('Backend logout error:', err));
  };

  return handleLogout;
}