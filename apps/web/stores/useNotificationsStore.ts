import { create } from "zustand";

interface NotificationsStore {
  refreshTrigger: number;
  triggerRefresh: () => void;
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  refreshTrigger: 0,
  triggerRefresh: () => set((state) => ({ refreshTrigger: state.refreshTrigger + 1 })),
}));
