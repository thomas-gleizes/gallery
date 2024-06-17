import { AssetType, DirectoryType, FilesTypes, FileType } from "../../types";

export function extractAssets(file: AssetType | DirectoryType): AssetType[] {
  if (file.type === "file") {
    return [file];
  } else return Object.values(file.files).flatMap(extractAssets);
}

export function extractAllSubDirectories(file: FilesTypes): DirectoryType[] {
  const directories: DirectoryType[] = [];

  for (const subFile of file) {
    if (subFile.type === "directory") {
      directories.push(subFile);
      directories.push(...extractAllSubDirectories(subFile.files));
    }
  }

  return directories;
}

export function getRecentTimestamp(files: FilesTypes): number {
  return files.reduce((acc, file) => {
    if (file.type === "directory") {
      return Math.max(acc, getRecentTimestamp(file.files));
    } else {
      return Math.max(acc, file.timestamp);
    }
  }, 0);
}

export const extensions = {
  video: ["MOV", "mp4", "qt", "MP4", "mov"],
  image: ["JPG", "jpg", "png", "JPEG", "jpeg", "GIF", "gif", "webp", "PNG"],
  other: ["txt", "zip", "7z", "rar"],
};

export const localKey = {
  FAVORITE: "favorite",
  FILES: "files",
};

export async function compress(
  string: string,
  encoding: CompressionFormat = "gzip",
): Promise<string> {
  const byteArray = new TextEncoder().encode(string);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  const buffer = await new Response(cs.readable).arrayBuffer();

  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
}

export async function decompress(
  string: string,
  encoding: CompressionFormat = "gzip",
): Promise<string> {
  const binary = window.atob(string);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const cs = new DecompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const buffer = await new Response(cs.readable).arrayBuffer();
  return new TextDecoder().decode(buffer);
}

export function parseSize(size: number) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

export function deepSort(
  files: FilesTypes,
  sortCallback: (a: FileType, b: FileType) => number,
): FilesTypes {
  for (const file of files) {
    if (file.type === "directory") {
      file.files = deepSort(file.files, sortCallback);
    }
  }

  return files.sort(sortCallback);
}

export function randomMinMax(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomSort<T = any>(array: T[]): T[] {
  const randomSortedArray: T[] = [];
  const tmpArray = [...array];

  for (let i = array.length - 1; i > 0; i--) {
    const index = randomMinMax(0, tmpArray.length - 1);
    randomSortedArray.push(tmpArray[index]);
    tmpArray.splice(index, 1);
  }

  return randomSortedArray;
}
