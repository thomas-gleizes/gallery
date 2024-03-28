import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import AssetsGrid from "@/components/AssetsGrid";
import { css } from "../../styled-system/css";
import { AssetType } from "../../types";
import { useDialog } from "react-dialog-promise";
import viewer from "@/components/Viewer";

interface Props {
  assets: AssetType[];
  title: string;
}

const PAGE_LENGTH = 100;

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
        startIndex: index + pageIndex * PAGE_LENGTH,
      });
  };

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
          {title} - {assets.length}
        </h2>
        <div>
          {pageIndex > 0 && (
            <Link href={`${pathname}?page=${pageIndex - 1}`}>Prev page</Link>
          )}
          {pageIndex < assets.length / PAGE_LENGTH &&
            assets.length > PAGE_LENGTH && (
              <Link href={`${pathname}?page=${pageIndex + 1}`}>Next page</Link>
            )}
        </div>
      </div>
      <AssetsGrid
        onView={handleView}
        assets={assets.slice(
          pageIndex * PAGE_LENGTH,
          (pageIndex + 1) * PAGE_LENGTH,
        )}
      />
      <div>
        {pageIndex > 0 && (
          <Link href={`${pathname}?page=${pageIndex - 1}`}>Prev page</Link>
        )}
        {pageIndex < assets.length / PAGE_LENGTH &&
          assets.length > PAGE_LENGTH && (
            <Link href={`${pathname}?page=${pageIndex + 1}`}>Next page</Link>
          )}
      </div>
    </div>
  );
};

export default Gallery;
