// /src/stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type UserRole = "buyer" | "seller" | "rider";

export interface User {
  _id: string;
  role: UserRole;
  email: string;
  phoneNumber?: string;
  referralCode?: string;

  // Buyer & Seller
  fullname?: string;
  photo?: string;
  university?: string;

  // Seller-specific
  businessName?: string;
  logo?: string;
  institution?: any;

  // Rider-specific (API returns "name" not "fullname")
  name?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User, token?: string) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;

  getDisplayName: () => string;
  getAvatar: () => string;
}

function getRoleFromToken(token: string): UserRole | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.role as UserRole) || null;
  } catch {
    return null;
  }
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user: User, token?: string) => {
        if (token && typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
        set({ user, isAuthenticated: true, isLoading: false });
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false, isLoading: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      fetchUser: async () => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        const api_url = process.env.NEXT_PUBLIC_API_URL;

        if (!token) {
          console.warn("No token — user not authenticated");
          get().clearUser();
          return;
        }

        if (!api_url) {
          console.error("NEXT_PUBLIC_API_URL is not set");
          return;
        }

        // Determine role from store (hydrated) or JWT (fresh refresh)
        const currentRole = get().user?.role || getRoleFromToken(token);

        // ✅ Rider has no /me endpoint — rely on persisted store data only
        // If rider user is already in store, do nothing
        if (currentRole === "rider") {
          const existingUser = get().user;
          if (existingUser) {
            set({ isAuthenticated: true });
            return;
          }
          // Rider user lost from store (e.g. storage cleared) — fetch from /api/v1/rider
          try {
            set({ isLoading: true });
            const res = await fetch(`${api_url}/api/v1/rider`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });

            if (!res.ok) {
              if (res.status === 401 || res.status === 403) {
                get().clearUser();
              }
              return;
            }

            const data = await res.json();
            if (data.status === "success") {
              get().setUser(data.data.user ?? data.data ?? data);
            } else {
              get().clearUser();
            }
          } catch (err) {
            console.error("Fetch rider error:", err);
            get().clearUser();
          } finally {
            set({ isLoading: false });
          }
          return;
        }

        // ✅ Buyer / Seller — use /api/v1/user/me
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
            if (res.status === 401 || res.status === 403) {
              console.warn("Token invalid or expired — clearing user");
              get().clearUser();
            }
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
          const currentRole = get().user?.role || getRoleFromToken(token ?? "");

          // Riders have no logout endpoint — skip the API call
          if (token && api_url && currentRole !== "rider") {
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

      getDisplayName: () => {
        const user = get().user;
        if (!user) return "";
        if (user.role === "seller") return user.businessName || "";
        if (user.role === "rider") return user.name || user.fullname || "";
        return user.fullname || "";
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
    }
  )
);