import React, { useMemo } from "react";
import { css } from "../../styled-system/css";
import { extractAssets } from "@/utils/helpers";
import { useRouter } from "next/router";
import { DirectoryType } from "../../types";

type Props = {
  directory: DirectoryType;
  inline?: boolean;
};

export const Folder: React.FC<Props> = ({ directory, inline }) => {
  const router = useRouter();

  const images = useMemo(() => {
    return extractAssets(directory)
      .filter((file) => file.file === "image")
      .slice(0, 4);
  }, [directory]);

  return (
    <div
      className={
        inline
          ? css({
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              gap: "2rem",
              width: "100%",
            })
          : css({ display: "block" })
      }
    >
      <div
        onClick={() => router.push(`/d/${directory.pathname}`)}
        className={css({
          bgColor: "gray.200",
          rounded: "lg",
          shadow: "lg",
          overflow: "hidden",
          cursor: "pointer",
        })}
      >
        <img
          src={images[0]?.url}
          alt={images[0]?.name}
          width={inline ? 300 : 300}
          height={inline ? 200 : 350}
          style={{ height: inline ? "200px" : "350px" }}
          className={css({
            bgGradient: "to-br",
            gradientTo: "gray.200",
            gradientFrom: "white",
            objectFit: "cover",
            objectPosition: "center",
          })}
        />
      </div>
      <p
        className={css(
          {
            textOverflow: "hidden",
            overflow: "hidden",
          },
          inline
            ? { fontSize: "2rem" }
            : { fontSize: "1.5rem", width: "300px" },
        )}
      >
        {directory.name}
      </p>
    </div>
  );
};

export default Folder;
