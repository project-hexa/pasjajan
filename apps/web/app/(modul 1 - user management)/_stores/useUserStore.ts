import { Customer, User } from "@/types/user";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  user: User | null;
  customer: Customer | null;
  isLoggedIn: boolean;
};

type Action = {
  setUser: (user: User) => void;
  setCustomer: (customer: Customer) => void;
  setIsLoggedIn: (state: boolean) => void;
};

export const useUserStore = create<State & Action>()(
  persist(
    (set) => ({
      user: null,
      customer: null,
      isLoggedIn: false,
      setUser: (user) => set({ user }),
      setCustomer: (customer) => set({ customer }),
      setIsLoggedIn: (state) => set({ isLoggedIn: state }),
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
