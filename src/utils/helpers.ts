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
