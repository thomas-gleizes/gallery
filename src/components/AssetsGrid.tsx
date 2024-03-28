import React from "react";
import { css } from "../../styled-system/css";
import { useDialog } from "react-dialog-promise";
import { useIsDisplay } from "@/hooks/useIsDisplay";
import Viewer from "@/components/Viewer";
import { AssetType } from "../../types";

type AssetProps = {
  asset: AssetType;
  onClick?: () => void;
  number?: number;
};

const Asset: React.FC<AssetProps> = ({ asset, onClick, number }) => {
  const [isDisplay, ref] = useIsDisplay<HTMLDivElement>(1.5);

  if (!asset.dimensions.width) {
    return null;
  }

  return (
    <div
      ref={ref}
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
        src={isDisplay ? asset.url : ""}
        alt={asset.name}
        className={css({
          bgColor: "gray.300",
          visibility: isDisplay ? "visible" : "hidden",
        })}
      />
    </div>
  );
};

type AssetsGridProps = {
  assets: AssetType[];
};

const AssetsGrid: React.FC<AssetsGridProps> = ({ assets }) => {
  const viewerDialog = useDialog(Viewer);

  const handleClick = async (asset: AssetType) => {
    const index = assets.findIndex((a) => a.hash === asset.hash);
    if (index === -1) throw new Error("Asset not found");

    if (viewerDialog.isOpen) return viewerDialog.close();
    await viewerDialog.open({ startIndex: index, assets });
  };

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
      {assets.slice(0, 99).map((asset, index) => (
        <Asset
          key={asset.hash}
          asset={asset}
          onClick={() => handleClick(asset)}
          number={index + 1}
        />
      ))}
    </div>
  );
};

export default AssetsGrid;
