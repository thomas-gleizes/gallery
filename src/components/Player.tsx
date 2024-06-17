import React, {
  MouseEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { AssetType } from "../../types";
import { css } from "../../styled-system/css";
import { useToggle } from "react-use";
import { FaPause, FaPlay } from "react-icons/fa6";
import { FaExpandAlt } from "react-icons/fa";
import { parseSize } from "@/utils/helpers";

export interface PlayerProps {
  asset: AssetType;
  autoPlay?: boolean;
  onEnd?: () => void;
}

const TimeBar: React.FC<{
  videoRef: RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  onSeek?: (time: number) => void;
}> = ({ videoRef, isPlaying, onSeek }) => {
  const [progression, setProgression] = useState<number>(0);

  useEffect(() => {
    if (!isPlaying) return;

    const handler = (event) => {
      const { currentTime, duration } = event.target;
      setProgression((currentTime / duration) * 100);
    };

    videoRef.current?.addEventListener("timeupdate", handler);

    return () => videoRef.current?.removeEventListener("timeupdate", handler);
  }, [isPlaying]);

  const handleSeek: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const percentage = (x / rect.width) * 100;
    const time = (percentage / 100) * videoRef.current!.duration;

    setProgression(percentage);
    onSeek?.(time);
  };

  return (
    <>
      <div
        className={css({ h: 1, rounded: "lg", bgColor: "red" })}
        style={{ backgroundColor: "rgba(210, 210, 210, .1)" }}
      >
        <div
          className={css({ h: 1, rounded: "lg", transition: "width 100ms" })}
          style={{
            width: `${progression}%`,
            backgroundColor: "rgba(210, 210, 210, .9)",
          }}
        />
      </div>
      <div
        onClick={handleSeek}
        className={css({
          cursor: "pointer",
          width: "full",
          height: 4,
          pos: "absolute",
          top: -1,
        })}
      />
    </>
  );
};

const TimeIndicator: React.FC<{
  videoRef: RefObject<HTMLVideoElement>;
}> = ({ videoRef }) => {
  const [currentTime, setCurrentTime] = useState<string>("00:00");

  function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes < 10 ? "0" + minutes : minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
  }

  useEffect(() => {
    const handler = (event) => {
      setCurrentTime(formatTime(event.target.currentTime));
    };

    videoRef.current?.addEventListener("timeupdate", handler);

    return () => videoRef.current?.removeEventListener("timeupdate", handler);
  }, []);

  return `${currentTime} / ${formatTime(videoRef.current?.duration || 0)}`;
};

const Player: React.FC<PlayerProps> = ({ asset, autoPlay }) => {
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [isPlaying, togglePlaying] = useToggle(false);
  const [displayOverlay, toggleOverlay] = useState<boolean>(false);
  const [isFullScreen, toggleFullScreen] = useToggle(false);

  const overlayTimeout = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = () => {
    if (displayOverlay) {
      overlayTimeout.current && clearTimeout(overlayTimeout.current);
    } else {
      toggleOverlay(true);
    }

    overlayTimeout.current = setTimeout(() => {
      toggleOverlay(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    switch (e.key) {
      case " ":
        togglePlaying();
        break;
      case "f":
        toggleFullScreen();
        break;
      case "ArrowRight":
        videoRef.current!.currentTime = Math.min(
          videoRef.current!.currentTime + 5,
          videoRef.current!.duration,
        );
        break;
      case "ArrowLeft":
        videoRef.current!.currentTime = Math.max(
          videoRef.current!.currentTime - 5,
          0,
        );
        break;
      case "ArrowUp":
        videoRef.current!.volume = Math.max(
          videoRef.current!.volume + 0.1,
          videoRef.current!.volume,
        );
        break;
      case "ArrowDown":
        videoRef.current!.volume = Math.max(videoRef.current!.volume - 0.1, 0);
        break;
    }
  };

  useEffect(() => {
    if (isPlaying && videoRef.current?.paused) {
      void videoRef.current?.play();
    } else if (!isPlaying && !videoRef.current?.paused) {
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isFullScreen && document.fullscreenElement === null) {
      containerRef.current?.requestFullscreen();
    } else if (!isFullScreen && document.fullscreenElement !== null) {
      document.exitFullscreen();
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (autoPlay) {
      setLoaded(true);
    }
  }, []);

  const handleSeek = (time: number) => {
    videoRef.current!.currentTime = time;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      className={css({
        pos: "relative",
        display: "flex",
        justifyContent: "center",
        rounded: "sm",
        overflow: "hidden",
        shadow: "md",
        w: "full",
        bgColor: isFullScreen ? "black" : "gray.50",
        userSelect: "none",
      })}
    >
      {isLoaded ? (
        <>
          <video
            onLoadedData={() => togglePlaying(true)}
            onClick={togglePlaying}
            onKeyDown={handleKeyDown}
            ref={videoRef}
            muted={true}
            src={asset.url}
          />
          {
            <div
              className={css({
                bottom: 0,
                left: 0,
                pos: "absolute",
                w: "full",
                h: 12,
                bg: "rgba(0, 0, 0, .3)",
                transition: "opacity 200ms",
                opacity: displayOverlay ? 1 : 0,
              })}
            >
              <TimeBar
                videoRef={videoRef}
                isPlaying={isPlaying}
                onSeek={handleSeek}
              />
              <div
                className={css({
                  px: 3,
                  display: "flex",
                  alignItems: "center",
                  h: "full",
                  justifyContent: "space-between",
                })}
              >
                <div
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  })}
                >
                  <div
                    onClick={togglePlaying}
                    className={css({
                      fontSize: "2xl",
                      color: "gray.100",
                      cursor: "pointer",
                    })}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </div>
                  <div
                    className={css({
                      fontSize: "lg",
                      color: "white",
                      fontWeight: "semibold",
                    })}
                  >
                    <TimeIndicator videoRef={videoRef} />
                  </div>
                </div>
                <div
                  onClick={toggleFullScreen}
                  className={css({
                    fontSize: "2xl",
                    color: "gray.100",
                    cursor: "pointer",
                  })}
                >
                  <FaExpandAlt />
                </div>
              </div>
            </div>
          }
        </>
      ) : (
        <div
          onClick={() => setLoaded(true)}
          className={css({
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            cursor: "pointer",
            h: "full",
            py: 4,
            width: "full",
          })}
        >
          <div>
            <FaPlay className={css({ fontSize: "6xl" })} />
          </div>
          <div>
            {asset.name.slice(
              Math.max(asset.name.length - 30, 0),
              asset.name.length,
            )}
          </div>
          <div>({parseSize(asset.size)})</div>
        </div>
      )}
    </div>
  );
};

export default Player;
