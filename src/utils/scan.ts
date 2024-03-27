import fs from "node:fs";
import { createHash } from "node:crypto";
import imageSize from "image-size";

import { extensions } from "@/utils/helpers";

export function hash(string: string) {
  return createHash("sha256").update(string).digest("hex");
}

export default async function scan(path: string, files: FilesTypes = []) {
  const info = await fs.promises
    .readdir(path)
    .then((files) =>
      files.filter((file) => !file.endsWith(".*") && !file.startsWith(".")),
    );

  for (const file of info) {
    const pathFile = `${path}/${file}`;
    const stat = await fs.promises.stat(pathFile);

    if (stat.isDirectory()) {
      let current: DirectoryType = {
        name: file,
        size: stat.size,
        type: "directory",
        hash: hash(pathFile),
        timestamp: stat.birthtime.getTime(),
        pathname: pathFile.split(".images").pop() as string,
        files: [],
      };

      files.push(current);

      await scan(`${path}/${file}`, current.files);
    } else {
      let current: AssetType = {
        name: file,
        size: stat.size,
        type: "file",
        hash: hash(pathFile),
        timestamp: stat.birthtime.getTime(),
        url: new URL(
          `http://exemple.com/static${pathFile.split(".images").pop()}`,
        ).pathname,
        file: "other",
        dimensions: { width: NaN, height: NaN, orientation: "unknown" },
      };

      if (extensions.image.includes(file.split(".").pop() as string)) {
        try {
          const dimensions = imageSize(pathFile);
          current.dimensions = {
            width: dimensions.width || 0,
            height: dimensions.height || 0,
            orientation: "unknown",
          };

          if (current.dimensions.width > current.dimensions.height)
            current.dimensions.orientation = "landscape";
          else if (current.dimensions.width < current.dimensions.height)
            current.dimensions.orientation = "portrait";
          else if (current.dimensions.width === current.dimensions.height)
            current.dimensions.orientation = "square";

          current.file = "image";
        } catch (error) {}
      } else if (extensions.video.includes(file.split(".").pop() as string)) {
        current.file = "video";
      }

      files.push(current as AssetType);
    }
  }

  return files.sort((a, b) => a.timestamp - b.timestamp);
}
