import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import AssetsGrid from "@/components/AssetsGrid";
import { css } from "../../styled-system/css";
import { AssetType } from "../../types";
import { useDialog } from "react-dialog-promise";
import viewer from "@/components/Viewer";
import { parseSize } from "@/utils/helpers";
import PageIndicator from "@/components/PageIndicator";

interface Props {
  assets: AssetType[];
  title: string;
}

const PAGE_LENGTH = 99;

export const Gallery: React.FC<Props> = ({ assets, title }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const viewerDialog = useDialog(viewer);

  const pageIndex: number = parseInt(searchParams.get("page") || "")
    ? parseInt(searchParams.get("page")!)
    : 0;

  const handleView = async (asset: AssetType) => {
    const index = assets.findIndex((find) => find.hash === asset.hash);
    if (index === -1) return;

    if (viewerDialog.isOpen) viewerDialog.close();
    else
      await viewerDialog.open({
        assets: assets,
        startIndex: index,
      });
  };

  const size = assets.reduce((acc, asset) => acc + asset.size, 0);

  return (
    <div>
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          my: 4,
        })}
      >
        <h2 className={css({ fontSize: "xl", fontWeight: "medium" })}>
          {title} - {assets.length} ({parseSize(size)})
        </h2>
        <PageIndicator
          currentPage={pageIndex}
          totalPages={assets.length / PAGE_LENGTH}
          pathname={pathname}
        />
      </div>
      <AssetsGrid
        onView={handleView}
        assets={assets.slice(
          pageIndex * PAGE_LENGTH,
          (pageIndex + 1) * PAGE_LENGTH,
        )}
      />
      <div className={css({ mt: 10, display: "flex", justifyContent: "end" })}>
        <PageIndicator
          currentPage={pageIndex}
          totalPages={assets.length / PAGE_LENGTH}
          pathname={pathname}
        />
      </div>
    </div>
  );
};

export default Gallery;
