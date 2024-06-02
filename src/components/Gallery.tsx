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
import { useToggle } from "react-use";
import Collapse from "@/components/Collapse";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface Props {
  assets: AssetType[];
  title: string;
  paginationSuffix?: string;
  defaultCollapsed?: boolean;
}

const PAGE_LENGTH = 99;

export const Gallery: React.FC<Props> = ({
  assets,
  title,
  paginationSuffix,
  defaultCollapsed,
}) => {
  const suffix = paginationSuffix || "page";

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isOpen, toggleOpen] = useToggle(defaultCollapsed ?? false);

  const viewerDialog = useDialog(viewer);

  const pageIndex: number = parseInt(searchParams.get(suffix) || "")
    ? parseInt(searchParams.get(suffix)!)
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
        <div
          className={css({
            display: "flex",
            justifyContent: "end",
            gap: 5,
            alignItems: "center",
          })}
        >
          <div
            className={css({ cursor: "pointer" })}
            onClick={() => toggleOpen()}
          >
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <PageIndicator
            currentPage={pageIndex}
            totalPages={assets.length / PAGE_LENGTH}
            pathname={pathname}
            paramKey={suffix}
          />
        </div>
      </div>
      <Collapse isOpen={isOpen}>
        <AssetsGrid
          onView={handleView}
          assets={assets.slice(
            pageIndex * PAGE_LENGTH,
            (pageIndex + 1) * PAGE_LENGTH,
          )}
        />
      </Collapse>
      {isOpen && (
        <div
          className={css({ mt: 10, display: "flex", justifyContent: "end" })}
        >
          <PageIndicator
            currentPage={pageIndex}
            totalPages={assets.length / PAGE_LENGTH}
            pathname={pathname}
            paramKey={suffix}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
