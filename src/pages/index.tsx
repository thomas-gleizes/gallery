import Head from "next/head";
import { NextPage } from "next";
import React, { useMemo } from "react";

import { extractAssets, localKey, parseSize } from "@/utils/helpers";
import Folder from "@/components/Folder";
import { css } from "../../styled-system/css";
import { useFileStore } from "@/stores/files";
import Gallery from "@/components/Gallery";
import { AssetType, DirectoryType, FileType } from "../../types";

const Home: NextPage = () => {
  const files = useFileStore((state) => state.files);

  // @ts-ignore
  const directories: DirectoryType[] = files.filter(
    (file: FileType) => file.type === "directory",
  );

  const assets = useMemo(() => {
    const assets: AssetType[] = directories
      .map((directory) => extractAssets(directory))
      .flat();
    const images: AssetType[] = [];
    const videos: AssetType[] = [];

    for (const asset of assets) {
      if (asset.file === "image") images.push(asset);
      else if (asset.file === "video") videos.push(asset);
    }

    return { images, videos };
  }, [directories]);

  const favoriteDirectories = useMemo<DirectoryType | null>(() => {
    const favorites = JSON.parse(
      localStorage.getItem(localKey.FAVORITE) || "[]",
    );

    const file = assets.images.find((asset) => favorites.includes(asset.hash));

    if (!file) return null;

    return {
      pathname: "/favorites",
      size: files.length,
      timestamp: 0,
      hash: "fave",
      name: "Favorites",
      type: "directory",
      files: [file],
    };
  }, []);

  const sizes = useMemo<number>(() => {
    return files.reduce((acc, file) => acc + file.size, 0);
  }, [files]);

  return (
    <div>
      <div className={css({ borderBottom: "1px solid", my: 4 })}>
        <h2 className={css({ fontSize: "xl", fontWeight: "medium" })}>
          Folders: {directories.length} / Assets:{" "}
          {assets.videos.length + assets.images.length} / Images:{" "}
          {assets.images.length} / Videos: {assets.videos.length} / Size:{" "}
          {parseSize(sizes)}
        </h2>
      </div>
      <div
        className={css({
          display: "flex",
          flexWrap: "wrap",
          justifyItems: "center",
          justifyContent: "center",
          gap: 5,
        })}
      >
        {favoriteDirectories && <Folder directory={favoriteDirectories} />}
        {directories.map((subDirectory) => (
          <Folder key={subDirectory.hash} directory={subDirectory} />
        ))}
      </div>
      <Gallery title="Images" assets={assets.images} />
    </div>
  );
};

export default Home;
