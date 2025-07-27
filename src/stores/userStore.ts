// stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  // Add other user properties as needed
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user: User) => {
        set({ 
          user, 
          isAuthenticated: true,
          isLoading: false 
        });
      },

      clearUser: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      fetchUser: async () => {
        const token = localStorage.getItem('token');
        const api_url = process.env.NEXT_PUBLIC_API_URL;

        if (!token || !api_url) {
          get().clearUser();
          return;
        }

        try {
          set({ isLoading: true });

          const res = await fetch(`${api_url}/api/v1/user/me`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!res.ok) {
            // Token is invalid
            localStorage.removeItem('token');
            get().clearUser();
            return;
          }

          const data = await res.json();

          if (data.status === 'success') {
            get().setUser(data.data.user);
          } else {
            localStorage.removeItem('token');
            get().clearUser();
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          // Don't clear user on network errors, might be temporary
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          const api_url = process.env.NEXT_PUBLIC_API_URL;
          const token = localStorage.getItem('token');
          
          if (api_url && token) {
            // Try to call server logout endpoint
            await fetch(`${api_url}/api/v1/auth/user/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
          }
        } catch (error) {
          console.error('Server logout error:', error);
          // Continue with local logout even if server fails
        } finally {
          // Always clear local data
          localStorage.removeItem('token');
          get().clearUser();
          
          // Redirect to login page
          window.location.href = '/auth/login';
        }
      },
    }),
    {
      name: 'user-storage', // Storage key
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // Only persist user and auth status, not loading state
    }
  )
);