import React, { useMemo } from "react";
import { css } from "../../styled-system/css";
import { useIsDisplay } from "@/hooks/useIsDisplay";
import { extractAssets } from "@/utils/helpers";
import { useRouter } from "next/router";
import Image from "next/image";

type Props = {
  directory: DirectoryType;
  isHomePage: boolean;
};

const FolderImage: React.FC<{ url: string }> = ({ url }) => {
  const [, ref] = useIsDisplay<HTMLDivElement>(1.2);
  const isDisplay = true;

  if (!url) return null;

  return (
    <div
      ref={ref}
      className={css({
        overflow: "hidden",
        display: "flex",
      })}
    >
      <Image
        src={url}
        width={300 / 2}
        height={350 / 2}
        className={css({
          objectFit: "cover",
          objectPosition: "center",
          bgColor: "gray.300",
        })}
        alt={url}
      />
    </div>
  );
};

export const Folder: React.FC<Props> = ({ directory, isHomePage = false }) => {
  const router = useRouter();

  const images = useMemo(() => {
    // return first images from four first subdirectories

    if (isHomePage) {
      const directories = directory.files.filter(
        (directory) => directory.type === "directory",
      );
      const images = [];

      for (const dir of directories) {
        const assets = extractAssets(dir);
        const imgs = assets.filter(
          (file) =>
            file.file === "image" &&
            file.dimensions.width <= file.dimensions.height,
        );

        if (imgs.length === 0) continue;
        images.push(imgs[0]);
        if (images.length === 4) break;
      }
      return images;
    }

    return extractAssets(directory)
      .filter(
        (file) =>
          file.file === "image" &&
          file.dimensions.width <= file.dimensions.height,
      )
      .slice(0, 4);
  }, [directory]);

  return (
    <div className={css({ display: "block" })}>
      <div
        onClick={() => router.push(`/directory${directory.pathname}`)}
        className={css({
          bgColor: "gray.200",
          rounded: "lg",
          shadow: "lg",
          display: "grid",
          gridTemplateColumns: images.length >= 3 ? "repeat(2, 1fr)" : "unset",
          width: "300px",
          height: "350px",
          overflow: "hidden",
        })}
      >
        <FolderImage url={images[0]?.url} />
        <FolderImage url={images[1]?.url} />
        <FolderImage url={images[2]?.url} />
        <FolderImage url={images[3]?.url} />
      </div>
      <p
        className={css({
          textOverflow: "hidden",
          overflow: "hidden",
          width: "200px",
        })}
      >
        {directory.name}
      </p>
    </div>
  );
};

export default Folder;
