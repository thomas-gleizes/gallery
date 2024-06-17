import { NextPage } from "next";
import { useMemo } from "react";

import { useFileStore } from "@/stores/files";
import { extractAssets, randomSort } from "@/utils/helpers";
import Gallery from "@/components/Gallery";
import { AssetType } from "../../types";

const RandomPage: NextPage = () => {
  const files = useFileStore((state) => state.files);

  const assets = useMemo<AssetType[]>(() => {
    const items: AssetType[] = [];

    for (const directory of Object.values(files)) {
      items.push(...extractAssets(directory));
    }

    return randomSort(items);
  }, [files]);

  return (
    <div>
      <Gallery
        title="Random"
        assets={assets}
        defaultCollapsed={true}
        paginationSuffix="rpage"
      />
    </div>
  );
};

export default RandomPage;
