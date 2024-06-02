import { NextPage } from "next";
import React, { useMemo } from "react";

import { useFileStore } from "@/stores/files";
import {
  deepSort,
  extractAllSubDirectories,
  extractAssets,
} from "@/utils/helpers";
import Gallery from "@/components/Gallery";
import { AssetType, DirectoryType } from "../../types";
import FolderGallery from "@/components/FolderGallery";

const LatestPage: NextPage = () => {
  const files = useFileStore((state) => state.files);

  const sortedFiles = useMemo(
    () => deepSort(files, (a, b) => b.timestamp - a.timestamp),
    [files],
  );

  const assets = useMemo<{ videos: AssetType[]; images: AssetType[] }>(() => {
    const assets: AssetType[] = [];

    for (const file of sortedFiles) {
      assets.push(...extractAssets(file));
    }

    const videos: AssetType[] = [];
    const images: AssetType[] = [];

    for (const asset of assets) {
      if (asset.file === "video") videos.push(asset);
      else images.push(asset);
    }

    return {
      videos,
      images,
    };
  }, [sortedFiles]);

  const subDirectories = useMemo<DirectoryType[]>(
    () =>
      extractAllSubDirectories(sortedFiles).sort(
        (a, b) => b.timestamp - a.timestamp,
      ),
    [sortedFiles],
  );

  return (
    <div>
      <FolderGallery
        title="Latest Directory"
        folders={subDirectories}
        displayEmpty={false}
        activeFilter={false}
        pagination="fpage"
        defaultCollapsed={true}
      />
      <Gallery
        title="Images"
        assets={assets.images}
        paginationSuffix="ipage"
        defaultCollapsed={true}
      />
      <Gallery
        title="Videos"
        assets={assets.videos}
        paginationSuffix="vpage"
        defaultCollapsed={false}
      />
    </div>
  );
};

export default LatestPage;
