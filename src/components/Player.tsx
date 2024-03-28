import React, { RefObject, useEffect, useRef, useState } from "react";
import { AssetType } from "../../types";
import { css } from "../../styled-system/css";
import { useToggle } from "react-use";

interface Props {
  asset: AssetType;
}

const TimeBar: React.FC<{
  videoRef: RefObject<HTMLVideoElement>;
  isPlaying: boolean;
}> = ({ videoRef, isPlaying }) => {
  const [progression, setProgression] = useState<number>(0);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgression(
          (videoRef.current?.currentTime! / videoRef.current?.duration!) * 100,
        );
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div
      className={css({ pos: "absolute", bottom: 0, left: 0, h: 1 })}
      style={{
        width: `${progression}%`,
        backgroundColor: "rgba(210, 210, 210, .9)",
      }}
    />
  );
};

const Player: React.FC<Props> = ({ asset }) => {
  const [isPlaying, togglePlaying] = useToggle(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isPlaying && videoRef.current?.paused) {
      void videoRef.current?.play();
    } else if (!isPlaying && !videoRef.current?.paused) {
      videoRef.current?.pause();
    }
  }, [isPlaying]);

  return null;

  return (
    <div
      className={css({ pos: "relative", rounded: "lg", overflow: "hidden" })}
    >
      <video ref={videoRef} muted={true}>
        <source src={asset.url} />
      </video>
      <TimeBar videoRef={videoRef} isPlaying={isPlaying} />
      <button
        className={css({ cursor: "pointer", pos: "absolute", top: 2, left: 2 })}
        onClick={togglePlaying}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default Player;
