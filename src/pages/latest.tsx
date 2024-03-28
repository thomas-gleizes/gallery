import { NextPage } from "next";
import React, { useMemo } from "react";

import { useFileStore } from "@/stores/files";
import { extractAssets } from "@/utils/helpers";
import Gallery from "@/components/Gallery";
import { AssetType } from "../../types";

const LatestPage: NextPage = () => {
  const files = useFileStore((state) => state.files);

  const assets = useMemo<AssetType[]>(() => {
    const assets: AssetType[] = [];

    for (const file of files) {
      assets.push(...extractAssets(file));
    }

    return assets.sort((a, b) => b.timestamp - a.timestamp);
  }, [files]);

  return (
    <div>
      <div>Latest images - {assets.length}</div>
      <Gallery title="Title" assets={assets} />
    </div>
  );
};

export default LatestPage;
