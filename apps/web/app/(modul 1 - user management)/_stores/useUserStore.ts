import { Customer, User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  customer: Customer | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  setIsLoggedIn: (state: boolean) => void;
  setCustomer: (customer: Customer) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      setUser: (user) => set({ user }),
      setIsLoggedIn: (state) => set({ isLoggedIn: state }),
      customer: null,
      setCustomer: (customer) => set({ customer }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
