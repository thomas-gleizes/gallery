import { NextPage } from "next";
import { useMemo } from "react";

import { useFileStore } from "@/stores/files";
import { extractAssets } from "@/utils/helpers";
import AssetsGrid from "@/components/AssetsGrid";
import Gallery from "@/components/Gallery";

const RandomPage: NextPage = () => {
  const files = useFileStore((state) => state.files);

  const assets = useMemo(() => {
    const items: AssetType[] = [];

    for (const directory of Object.values(files)) {
      items.push(...extractAssets(directory));
    }

    return {
      photos: items
        .filter((photo) => photo.file === "image")
        .sort(() => Math.random() - 0.5),
      videos: [],
    };
  }, [files]);

  return (
    <div>
      <Gallery title="Random" assets={assets.photos} />
    </div>
  );
};

export default RandomPage;
