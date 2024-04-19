import { create } from "zustand";
import { FilesTypes } from "../../types";
import { compress, decompress } from "@/utils/helpers";

export const useFileStore = create<{
  files: FilesTypes;
  loading: boolean;
  ready: boolean;
  init: (refresh: boolean) => void;
}>((set) => ({
  files: [],
  ready: false,
  loading: false,
  init: async (refresh: boolean) => {
    try {
      set({ loading: true });
      const query = refresh ? "?latest" : "";

      const response = await fetch(`/api/scan${query}`);
      const files = await response.json();

      set({ files, ready: true, loading: false });
    } catch (error) {
      set({ ready: false, loading: false });
    }
  },
}));
