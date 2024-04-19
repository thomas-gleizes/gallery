import { create } from "zustand";

interface SettingsStore {
  viewerDelay: number;
  setViewerDelay: (delay: number) => void;
  gallery: "grid" | "list";
  toggleGallery: () => void;
  filter: string;
  setFilter: (filter: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  viewerDelay: 2000,
  setViewerDelay: (delay) => {
    set({ viewerDelay: delay });
  },
  gallery: "grid",
  toggleGallery: () => {
    set((state) => ({ gallery: state.gallery === "grid" ? "list" : "grid" }));
  },
  filter: "",
  setFilter: (filter) => set({ filter }),
}));
