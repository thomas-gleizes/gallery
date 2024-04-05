import React, { MouseEventHandler, useEffect, useState } from "react";
import { DialogComponent } from "react-dialog-promise";
import { css } from "../../styled-system/css";
import { AssetType } from "../../types";
import Player from "@/components/Player";
import { FaStar } from "react-icons/fa6";
import { localKey } from "@/utils/helpers";

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
      onClick={(event) => !event.isDefaultPrevented() && close()}
    >
      <div
        onClick={(event) => event.preventDefault()}
        className={css({ display: "flex", justifyContent: "space-between" })}
      >
        <div
          className={css({
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            gap: 5,
            top: 4,
            right: 4,
          })}
        >
          <div
            onClick={toggleFavorite}
            className={css({
              bgColor: "white",
              rounded: "md",
              p: 1,
              fontSize: "lg",
            })}
          >
            <FaStar color={isFavorite ? "#ffdf06" : "#000000"} />
          </div>
          <div
            className={css({
              textShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "bold",
            })}
          >
            {currentIndex + 1} / {assets.length}
          </div>
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
