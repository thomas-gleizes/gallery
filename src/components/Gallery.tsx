import AssetsGrid from "@/components/AssetsGrid";
import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { css } from "../../styled-system/css";
import Link from "next/link";

interface Props {
  assets: AssetType[];
  title: string;
}

const VALUE = 100;

export const Gallery: React.FC<Props> = ({ assets, title }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageIndex: number = parseInt(searchParams.get("page") || "")
    ? parseInt(searchParams.get("page")!)
    : 0;

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
          {pageIndex < assets.length / VALUE && (
            <Link href={`${pathname}?page=${pageIndex + 1}`}>Next page</Link>
          )}
        </div>
      </div>
      <AssetsGrid
        assets={assets.slice(pageIndex * VALUE, (pageIndex + 1) * VALUE)}
      />
      <div>
        {pageIndex > 0 && (
          <Link href={`${pathname}?page=${pageIndex - 1}`}>Prev page</Link>
        )}
        {pageIndex < assets.length / VALUE && (
          <Link href={`${pathname}?page=${pageIndex + 1}`}>Next page</Link>
        )}
      </div>
    </div>
  );
};

export default Gallery;
