// /src/stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "buyer" | "seller";

export interface User {
  _id: string;
  role: UserRole;
  email: string;
  phone?: string;
  referralCode?: string;

  // Buyer-specific
  fullname?: string;
  photo?: string;
  university?: string;

  // Seller-specific
  businessName?: string;
  logo?: string;
  institution?: any;
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

  // Computed helpers
  getDisplayName: () => string;
  getAvatar: () => string;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user: User) => {
        set({ user, isAuthenticated: true, isLoading: false });
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
        if (typeof window !== "undefined") localStorage.removeItem("token");
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      fetchUser: async () => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        const api_url = process.env.NEXT_PUBLIC_API_URL;

        if (!token || !api_url) {
          get().clearUser();
          return;
        }

        try {
          set({ isLoading: true });

          const res = await fetch(`${api_url}/api/v1/user/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            get().clearUser();
            return;
          }

          const data = await res.json();

          if (data.status === "success") {
            get().setUser(data.data.user);
          } else {
            get().clearUser();
          }
        } catch (err) {
          console.error("Fetch user error:", err);
          get().clearUser();
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          const token = localStorage.getItem("token");
          const api_url = process.env.NEXT_PUBLIC_API_URL;

          if (token && api_url) {
            await fetch(`${api_url}/api/v1/auth/user/logout`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
          }
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          localStorage.removeItem("token");
          get().clearUser();
          window.location.href = "/login";
        }
      },

      // Helpers to get role-specific display values
      getDisplayName: () => {
        const user = get().user;
        if (!user) return "";
        return user.role === "seller" ? user.businessName || "" : user.fullname || "";
      },

      getAvatar: () => {
        const user = get().user;
        if (!user) return "";
        return user.role === "seller" ? user.logo || "" : user.photo || "";
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      skipHydration: false,
    }
  )
);