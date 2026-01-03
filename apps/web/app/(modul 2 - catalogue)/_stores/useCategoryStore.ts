import { Category } from "@/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  category: Category[];
  loading: boolean;
};

type Actions = {
  setCategory: (state: Category[]) => void;
  setLoading: (state: boolean) => void;
};

export const useCategoryStore = create<State & Actions>()(
  persist(
    (set) => ({
      category: [],
      loading: false,
      setCategory: (state) => set({ category: state }),
      setLoading: (state) => set({ loading: state }),
    }),
    {
      name: "category-product",
    },
  ),
);
