import { create } from 'zustand';

interface User {
  _id: string;
  fullname: string;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  hasHydrated: false,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setHasHydrated: (value) => set({ hasHydrated: value }),
}));

export default useUserStore;