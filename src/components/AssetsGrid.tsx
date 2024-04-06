import React from "react";
import { css } from "../../styled-system/css";
import { AssetType } from "../../types";
import Player from "@/components/Player";

type AssetProps = {
  asset: AssetType;
  onClick?: () => void;
  number?: number;
};

const Asset: React.FC<AssetProps> = ({ asset, onClick, number }) => {
  if (!asset.dimensions.width) {
    return null;
  }

  return (
    <div
      onClick={onClick}
      className={css({
        rounded: "lg",
        overflow: "hidden",
        position: "relative",
      })}
    >
      {number && (
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
          {number}
        </div>
      )}
      <img
        width={asset.dimensions.width}
        height={asset.dimensions.height}
        alt={asset.name}
        className={css({ bgColor: "gray.300", maxWidth: "99vmw" })}
        src={asset.url}
      />
    </div>
  );
};

type AssetsGridProps = {
  assets: AssetType[];
  onView?: (asset: AssetType) => void;
};

const AssetsGrid: React.FC<AssetsGridProps> = ({ assets, onView }) => {
  return (
    <div
      className={css({
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 500px)",
        gap: "1rem",
        justifyContent: "center",
        alignItems: "center",
        gridAutoRows: "auto",
      })}
    >
      {assets.map((asset, index) =>
        asset.file === "image" ? (
          <Asset
            key={asset.hash}
            asset={asset}
            onClick={() => onView && onView(asset)}
            number={index + 1}
          />
        ) : asset.file === "video" ? (
          <Player key={asset.hash} asset={asset} />
        ) : null,
      )}
    </div>
  );
};

export default AssetsGrid;
