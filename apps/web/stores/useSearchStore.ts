import { create } from "zustand";

type SearchStore = {
  search: string;
  setSearch: (s: string) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  search: "",
  setSearch: (s: string) => set({ search: s }),
}));
