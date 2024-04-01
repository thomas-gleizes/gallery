import { NextPage } from "next";
import React, { useMemo } from "react";

import { useFileStore } from "@/stores/files";
import { extractAssets } from "@/utils/helpers";
import Gallery from "@/components/Gallery";
import { AssetType } from "../../types";

const LatestPage: NextPage = () => {
  const files = useFileStore((state) => state.files);

  const assets = useMemo<{ videos: AssetType[]; images: AssetType[] }>(() => {
    const assets: AssetType[] = [];

    for (const file of files) {
      assets.push(...extractAssets(file));
    }

    const videos: AssetType[] = [];
    const images: AssetType[] = [];

    for (const asset of assets) {
      if (asset.file === "video") videos.push(asset);
      else images.push(asset);
    }

    return {
      videos: videos.sort((a, b) => b.timestamp - a.timestamp),
      images: images.sort((a, b) => b.timestamp - a.timestamp),
    };
  }, [files]);

  return (
    <div>
      <Gallery title="Videos" assets={assets.videos} />
      <Gallery title="Images" assets={assets.images} />
    </div>
  );
};

export default LatestPage;
