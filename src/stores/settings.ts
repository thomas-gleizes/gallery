import { create } from "zustand";

interface SettingsStore {
  viewerDelay: number;
  setViewerDelay: (delay: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  viewerDelay: 2000,
  setViewerDelay: (delay) => {
    set({ viewerDelay: delay });
  },
}));
