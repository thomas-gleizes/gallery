import React, { useMemo, useRef, useState } from "react";
import { useEvent } from "react-use";
import { css } from "../../styled-system/css";
import { AssetType } from "../../types";

type AssetsGridProps = {
  assets: AssetType[];
  onView?: (asset: AssetType) => void;
};

type Column = {
  height: number;
  assets: {
    asset: AssetType;
    top: number;
    height: number;
    width: number;
  }[];
};

const AssetsGrid: React.FC<AssetsGridProps> = ({ assets, onView }) => {
  function getColumnCount(width: number) {
    return Math.max(1, Math.floor(width / 500));
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const gridWidth = useRef<number>(window.innerWidth);
  const [columnCount, setColumnCount] = useState<number>(
    getColumnCount(gridWidth.current),
  );

  const columns = useMemo<Column[]>(() => {
    const cols: Column[] = Array.from({ length: columnCount }, () => ({
      height: 0,
      assets: [],
    }));

    const colWidth = gridWidth.current / cols.length;

    let minColIndex: number = 0;
    for (const asset of assets) {
      if (asset.file !== "image") continue;

      const height =
        asset.dimensions.height * (colWidth / asset.dimensions.width);

      cols[minColIndex].assets.push({
        asset,
        top: cols[minColIndex].height,
        height,
        width: colWidth,
      });
      cols[minColIndex].height += height;

      minColIndex = cols.reduce((minIndex, col, index) => {
        if (col.height < cols[minIndex].height) {
          return index;
        }

        return minIndex;
      }, 0);
    }

    return cols;
  }, [columnCount, assets]);

  function handleSize() {
    if (!containerRef.current) return;

    gridWidth.current = containerRef.current.clientWidth;
    setColumnCount(getColumnCount(gridWidth.current));
  }

  useEvent("resize", () => handleSize(), window);

  return (
    <div
      className={css({
        pos: "relative",
        display: "flex",
      })}
      style={{ height: Math.max(...columns.map((col) => col.height)) }}
      ref={containerRef}
    >
      {columns.map((col, colIndex) => (
        <React.Fragment key={colIndex}>
          {col.assets.map(({ asset, top, height, width }) => (
            <div
              key={asset.hash}
              onClick={() => onView?.(asset)}
              style={{
                position: "absolute",
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                left: `${(gridWidth.current / columns.length) * colIndex}px`,
              }}
              className={css({ p: 2 })}
            >
              <img
                alt={asset.name}
                height={height}
                width={width}
                src={asset.url}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default AssetsGrid;
