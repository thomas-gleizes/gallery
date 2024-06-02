import { create } from "zustand";

interface SettingsStore {
  viewerDelay: number;
  setViewerDelay: (delay: number) => void;
  gallery: "grid" | "list";
  toggleGallery: () => void;
  filter: string;
  setFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  order:
    | "alphabetical-a"
    | "alphabetical-z"
    | "time-ascending"
    | "time-descending";
  toggleOrder: () => void;
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
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  order: "alphabetical-a",
  toggleOrder: () =>
    set((state) => {
      switch (state.order) {
        case "alphabetical-a":
          return { order: "alphabetical-z" };
        case "alphabetical-z":
          return { order: "time-ascending" };
        case "time-ascending":
          return { order: "time-descending" };
        case "time-descending":
          return { order: "alphabetical-a" };
      }
    }),
}));
