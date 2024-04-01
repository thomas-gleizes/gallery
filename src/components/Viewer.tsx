import React, { useEffect, useState } from "react";
import { DialogComponent } from "react-dialog-promise";
import { css } from "../../styled-system/css";
import { AssetType } from "../../types";
import Player from "@/components/Player";

type Props = {
  assets: AssetType[];
  startIndex: number;
};

const Viewer: DialogComponent<Props, void> = ({
  close,
  startIndex,
  assets,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => void (document.body.style.overflow = "auto");
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const currentAsset = assets[currentIndex];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Escape":
          close();
          break;
        case "ArrowRight":
        case " ":
          setCurrentIndex((prev) => (prev + 1) % assets.length);
          break;
        case "ArrowLeft":
          setCurrentIndex((prev) => (prev - 1 + assets.length) % assets.length);
          break;
      }
    };

    document.body.addEventListener("keydown", handleKeyDown);
    return () => document.body.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={css({
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      })}
      onClick={() => close()}
    >
      <div
        className={css({ display: "flex", justifyContent: "space-between" })}
      >
        <div
          className={css({
            textShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
            color: "rgba(255, 255, 255, 0.7)",
            position: "absolute",
            fontWeight: "bold",
            top: 4,
            right: 4,
          })}
        >
          {currentIndex + 1} / {assets.length}
        </div>
        {currentAsset.file === "image" ? (
          <img
            className={css({ bgColor: "gray.300", maxH: "99vh", maxW: "99vw" })}
            src={currentAsset.url}
            alt={currentAsset.name}
          />
        ) : (
          <Player asset={currentAsset} />
        )}
      </div>
    </div>
  );
};

export default Viewer;
