import React, { useEffect, useState } from "react";
import { DialogComponent } from "react-dialog-promise";
import { css } from "../../styled-system/css";
import { AssetType } from "../../types";
import Player from "@/components/Player";
import { FaStar } from "react-icons/fa6";
import { localKey, parseSize } from "@/utils/helpers";
import { FaExpandAlt, FaSync } from "react-icons/fa";

type Props = {
  assets: AssetType[];
  startIndex: number;
};

const classnmes = {
  overlay: css({
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
  }),
  container: css({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: 5,
    top: 4,
    right: 4,
  }),
  favContainer: css({
    bgColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 7,
    height: 7,
    rounded: "sm",
    fontSize: "xl",
  }),
  indexContainer: css({
    textShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "bold",
  }),
  statsContainer: css({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: 5,
    bottom: 4,
    right: 4,
    color: "white",
    bgColor: "rgba(0, 0, 0, 0.5)",
  }),
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

  const [zoom, setZoom] = useState<"large" | "height">("large");

  const checkFavorite = (hash: string) => {
    const favorites = JSON.parse(
      localStorage.getItem(localKey.favorite) || "[]",
    );
    return favorites.includes(hash);
  };

  const [currentIndex, setCurrentIndex] = useState<number>(startIndex);
  const currentAsset = assets[currentIndex];
  const [isFavorite, setIsFavorite] = useState<boolean>(
    checkFavorite(currentAsset.hash),
  );

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

  useEffect(() => {
    setIsFavorite(checkFavorite(currentAsset.hash));
  }, [currentIndex]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem(localKey.favorite) || "[]",
    );

    if (favorites.includes(currentAsset.hash)) {
      localStorage.setItem(
        localKey.favorite,
        JSON.stringify(
          favorites.filter((hash: string) => hash !== currentAsset.hash),
        ),
      );
    } else {
      localStorage.setItem(
        localKey.favorite,
        JSON.stringify([...favorites, currentAsset.hash]),
      );
    }

    setIsFavorite((prev) => !prev);
  };

  return (
    <div
      className={classnmes.overlay}
      onClick={(event) => !event.isDefaultPrevented() && close()}
    >
      <div
        onClick={(event) => event.preventDefault()}
        className={css({
          display: "flex",
          justifyContent: "space-between",
          overflowY: "auto",
        })}
      >
        <div className={classnmes.container}>
          <div
            onClick={() =>
              setZoom((prev) => (prev === "large" ? "height" : "large"))
            }
            className={classnmes.favContainer}
          >
            {zoom === "large" ? <FaExpandAlt /> : <FaSync />}
          </div>
          <div onClick={toggleFavorite} className={classnmes.favContainer}>
            <FaStar color={isFavorite ? "#ffdf06" : "#000000"} />
          </div>
          <div className={classnmes.indexContainer}>
            {currentIndex + 1} / {assets.length}
          </div>
        </div>
        <div className={classnmes.statsContainer}>
          <div>{currentAsset.name}</div>
          <div>
            {currentAsset.dimensions.width}x{currentAsset.dimensions.height}
          </div>
          <div>{parseSize(currentAsset.size)}</div>
        </div>
        {currentAsset.file === "image" ? (
          <div>
            <img
              key={currentAsset.hash}
              className={css({ bgColor: "gray.300" })}
              src={currentAsset.url}
              alt={currentAsset.name}
              style={{
                maxHeight: zoom === "large" ? "99vh" : "unset",
                maxWidth: zoom === "large" ? "99vw" : "unset",
                height: "auto",
                width: "auto",
              }}
            />
          </div>
        ) : (
          <Player asset={currentAsset} />
        )}
      </div>
    </div>
  );
};

export default Viewer;
