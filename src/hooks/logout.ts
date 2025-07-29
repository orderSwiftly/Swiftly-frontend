// utils/logout.ts
'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useUserStore } from '@/stores/userStore'; // Fixed import - should be useUserStore, not userStore

export default function useLogout() {
  const router = useRouter();
  const { clearUser } = useUserStore(); // This is correct now

  const handleLogout = async () => {
    try {
      const api_url = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem('token'); // Get token for authorization
      
      // Call logout endpoint with proper auth
      const res = await fetch(`${api_url}/api/v1/auth/user/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Use token instead of cookies
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        // Clear localStorage token
        localStorage.removeItem('token');
        
        // Clear user state
        clearUser();
        
        toast.success(data.message ?? 'Logged out successfully!');
        router.push('/login'); // Fixed route path
      } else {
        toast.error(data.message ?? 'Logout failed.');
      }
    } catch (error) {
      // Even if server logout fails, clear local data
      localStorage.removeItem('token');
      clearUser();
      
      toast.success('Logged out successfully!');
      router.push('/auth/login');
      
      console.error('Logout error:', error);
    }
  };

  return handleLogout;
}