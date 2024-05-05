import React, { useMemo } from "react";
import { css } from "../../styled-system/css";
import { extractAssets } from "@/utils/helpers";
import { useRouter } from "next/router";
import { DirectoryType } from "../../types";

type Props = {
  directory: DirectoryType;
};

export const Folder: React.FC<Props> = ({ directory }) => {
  const router = useRouter();

  const images = useMemo(() => {
    return extractAssets(directory)
      .filter((file) => file.file === "image")
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
