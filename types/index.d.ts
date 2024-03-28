import { extensions } from "@/utils/helpers";

export type DirectoryType = {
  name: string;
  size: number;
  type: "directory";
  files: FilesTypes;
  hash: string;
  pathname: string;
  timestamp: number;
};
export type AssetType = {
  name: string;
  size: number;
  type: "file";
  url: string;
  hash: string;
  timestamp: number;
  file: keyof typeof extensions;
  dimensions: {
    width: number;
    height: number;
    orientation: "portrait" | "landscape" | "square" | "unknown";
  };
};
export type FileType = DirectoryType | AssetType;
export type FilesTypes = Array<FileType>;
