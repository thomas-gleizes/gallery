import React, { useMemo, useRef, useState } from "react";
import { useMount } from "react-use";
import { css } from "../../styled-system/css";
import { AssetType } from "../../types";

type AssetsGridProps = {
  assets: AssetType[];
  onView?: (asset: AssetType) => void;
};

type Column = {
  height: number;
  items: Item[];
};

type Item = {
  asset: AssetType;
  top: number;
  height: number;
  width: number;
  left: number;
};

const AssetsGrid: React.FC<AssetsGridProps> = ({ assets, onView }) => {
  const calculateColumn = (width: number) => {
    const count = Math.max(1, Math.floor(width / 400));

    return {
      count,
      width: width / count,
    };
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const gridWidth = useRef<number>(window.innerWidth);
  const [column, setColumn] = useState<{ count: number; width: number }>(
    calculateColumn(gridWidth.current),
  );

  const [items, height] = useMemo<[Item[], number]>(() => {
    const cols: Column[] = Array.from({ length: column?.count }, () => ({
      height: 0,
      items: [],
    }));

    let minColIndex: number = 0;
    for (const asset of assets) {
      if (asset.file !== "image") continue;

      const height =
        asset.dimensions.height * (column.width / asset.dimensions.width);

      cols[minColIndex].items.push({
        asset,
        top: cols[minColIndex].height,
        height,
        width: column.width,
        left: column.width * minColIndex,
      });
      cols[minColIndex].height += height;

      minColIndex = cols.reduce((minIndex, col, index) => {
        if (col.height < cols[minIndex].height) {
          return index;
        }

        return minIndex;
      }, 0);
    }

    return [
      cols.flatMap((col) => col.items).sort((a, b) => a.top - b.top),
      Math.max(...cols.map((col) => col.height)),
    ];
  }, [column, assets]);

  function handleSize() {
    if (!containerRef.current) return;

    gridWidth.current = containerRef.current.clientWidth;
    setColumn(calculateColumn(gridWidth.current));
  }

  useMount(() => {
    const resizeObserver = new ResizeObserver(handleSize);

    resizeObserver.observe(containerRef.current!);
  });

  useMount(handleSize);

  return (
    <div
      className={css({ pos: "relative", mx: "auto" })}
      style={{ height }}
      ref={containerRef}
    >
      {items.map(({ asset, top, height, width, left }) => (
        <div
          key={asset.hash}
          onClick={() => onView?.(asset)}
          style={{
            position: "absolute",
            transform: `translate(${left}px, ${top}px)`,
          }}
        >
          <img
            className={css({ p: 1, rounded: "2xl" })}
            alt={asset.name}
            height={height}
            width={width}
            src={asset.url}
          />
        </div>
      ))}
    </div>
  );
};

export default AssetsGrid;
