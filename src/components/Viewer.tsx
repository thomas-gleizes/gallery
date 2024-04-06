import React, { useEffect, useRef, useState } from "react";
import { FaRandom } from "react-icons/fa";
import {
  FaMaximize,
  FaMinimize,
  FaPause,
  FaPlay,
  FaStar,
} from "react-icons/fa6";
import { DialogComponent } from "react-dialog-promise";

import { css } from "../../styled-system/css";
import { AssetType } from "../../types";
import Player from "@/components/Player";
import { localKey, parseSize } from "@/utils/helpers";
import { useSettingsStore } from "@/stores/settings";

type Props = {
  assets: AssetType[];
  startIndex: number;
};

const classnames = {
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
  actionContainer: css({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
    gap: 4,
    top: 4,
    p: 2,
    right: 4,
    rounded: "sm",
    color: "white",
    bgColor: "rgba(0, 0, 0, 0.5)",
  }),
  statsContainer: css({
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "end",
    bottom: 4,
    right: 4,
    p: 2,
    rounded: "sm",
    color: "white",
    bgColor: "rgba(0, 0, 0, 0.5)",
  }),
  imgContainer: css({
    display: "flex",
    justifyContent: "space-between",
    overflowY: "auto",
  }),
  iconButton: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: 8,
    h: 8,
    rounded: "sm",
    cursor: "pointer",
    bgColor: "rgba(255, 255, 255, 0.5)",
    border: "1px solid white",
  }),
};

const ProgressBar: React.FC<{ index: number; delay: number }> = ({
  index,
  delay,
}) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (progress === 100) setProgress(0);
  }, [index]);

  useEffect(() => {
    if (progress === 0) setTimeout(() => setProgress(100), 10);
  }, [progress]);

  return (
    <div
      className={css({
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        h: 1,
      })}
    >
      <div
        style={{
          width: `${progress}%`,
          transitionDuration: `${progress === 0 ? 0 : delay}ms`,
          transitionProperty: "width",
          transitionTimingFunction: "linear",
        }}
        className={css({
          h: "full",
          bgColor: "rgba(255, 255, 255, 0.9)",
        })}
      />
    </div>
  );
};

const Viewer: DialogComponent<Props, void> = ({
  close,
  startIndex,
  assets: initialAssets,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => void (document.body.style.overflow = "auto");
  }, []);

  const settingsStore = useSettingsStore();

  const [zoom, setZoom] = useState<"large" | "height">("large");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isRandom, setIsRandom] = useState<boolean>(false);
  const [assets, setAssets] = useState<AssetType[]>(initialAssets);

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

  useEffect(() => {
    if (!isPlaying && settingsStore.viewerDelay > 0) return;

    const timeout = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % assets.length);
    }, settingsStore.viewerDelay);

    return () => clearInterval(timeout);
  }, [isPlaying, currentAsset]);

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

  const toggleRandom = () => {
    setIsRandom((prev) => !prev);
    if (isRandom) {
      setAssets(initialAssets);
    } else {
      const shuffled = [...assets].sort(() => Math.random() - 0.5);
      setAssets(shuffled);
    }
  };

  return (
    <div
      className={classnames.overlay}
      onClick={(event) => !event.isDefaultPrevented() && close()}
    >
      <div
        onClick={(event) => event.preventDefault()}
        className={classnames.actionContainer}
      >
        <button
          className={classnames.iconButton}
          onClick={() => toggleRandom()}
        >
          <FaRandom />
        </button>
        <button
          className={classnames.iconButton}
          onClick={() =>
            setZoom((prev) => (prev === "large" ? "height" : "large"))
          }
        >
          {zoom === "large" ? <FaMaximize /> : <FaMinimize />}
        </button>
        <button className={classnames.iconButton} onClick={toggleFavorite}>
          <FaStar color={isFavorite ? "#ffdf06" : "#FFFFFF"} />
        </button>
        <button
          className={classnames.iconButton}
          onClick={() => setIsPlaying((state) => !state)}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <div>
          {currentIndex + 1} / {assets.length}
        </div>
      </div>
      <div
        onClick={(event) => event.preventDefault()}
        className={classnames.statsContainer}
      >
        <div>{currentAsset.name}</div>
        <div>
          {currentAsset.dimensions.width}x{currentAsset.dimensions.height}
        </div>
        <div>{parseSize(currentAsset.size)}</div>
        <div>
          {new Date(currentAsset.timestamp).toLocaleDateString()}{" "}
          {new Date(currentAsset.timestamp).toLocaleTimeString()}
        </div>
      </div>
      <div
        onClick={(event) => event.preventDefault()}
        className={classnames.imgContainer}
      >
        {isPlaying && (
          <ProgressBar delay={settingsStore.viewerDelay} index={currentIndex} />
        )}

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
