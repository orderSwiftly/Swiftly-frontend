import { create } from 'zustand';

interface User {
  _id: string;
  fullname: string;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;
  hasHydrated: boolean;
  isAuthChecked: boolean;
  setUser: (user: User | null) => void;
  setHasHydrated: (hydrated: boolean) => void;
  setIsAuthChecked: (checked: boolean) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  hasHydrated: false,
  isAuthChecked: false,
  setUser: (user) => set({ user }),
  setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
  setIsAuthChecked: (checked) => set({ isAuthChecked: checked }),
  clearUser: () =>
    set({
      user: null,
      hasHydrated: false,
      isAuthChecked: false,
    }),
}));

export default useUserStore;