import { create } from "zustand";

type SearchStore = {
  search: string;
  setSearch: (value: string) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  search: "",
  setSearch: (value: string) => set({ search: value }),
}));
