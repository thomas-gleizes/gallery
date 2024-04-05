import { create } from "zustand";
import { FilesTypes } from "../../types";
import { compress, decompress } from "@/utils/helpers";

export const useFileStore = create<{
  files: FilesTypes;
  loading: boolean;
  ready: boolean;
  init: () => void;
}>((set) => ({
  files: [],
  ready: false,
  loading: false,
  init: async () => {
    try {
      const storage = localStorage.getItem("files");
      if (storage) {
        await decompress(storage)
          .then((data) =>
            set({ files: JSON.parse(data), ready: true, loading: true }),
          )
          .catch((error) => console.warn("Error Decompressing files", error));
      } else {
        set({ loading: true });
      }

      const response = await fetch("/api/scan");
      const files = await response.json();

      set({ files, ready: true, loading: false });

      compress(JSON.stringify(files))
        .then((compressed) => localStorage.setItem("files", compressed))
        .catch((error) => console.warn("Error compressing files", error));
    } catch (error) {
      set({ ready: false, loading: false });
    }
  },
}));
