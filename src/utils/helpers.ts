import { AssetType, DirectoryType } from "../../types";

export function extractAssets(file: AssetType | DirectoryType): AssetType[] {
  if (file.type === "file") {
    return [file];
  } else return Object.values(file.files).flatMap(extractAssets);
}

export const extensions = {
  video: ["MOV", "mp4", "qt", "MP4", "mov"],
  image: ["JPG", "jpg", "png", "JPEG", "jpeg", "GIF", "gif", "webp", "PNG"],
  other: ["txt", "zip", "7z", "rar"],
};
