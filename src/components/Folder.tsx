import React, { useMemo } from "react";
import { css } from "../../styled-system/css";
import { useIsDisplay } from "@/hooks/useIsDisplay";
import { extractAssets } from "@/utils/helpers";
import { useRouter } from "next/router";
import { DirectoryType } from "../../types";
import Image from "next/image";

type Props = {
  directory: DirectoryType;
  isHomePage: boolean;
};

export const Folder: React.FC<Props> = ({ directory, isHomePage = false }) => {
  const router = useRouter();

  const images = useMemo(() => {
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
          width: "300px",
          height: "350px",
          overflow: "hidden",
        })}
      >
        <img
          src={images[0]?.url}
          alt={images[0]?.name}
          width={300}
          height={350}
          className={css({
            w: "100%",
            h: "100%",
            bgGradient: "to-br",
            gradientTo: "gray.200",
            gradientFrom: "white",
            objectFit: "cover",
            objectPosition: "center",
          })}
        />
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
