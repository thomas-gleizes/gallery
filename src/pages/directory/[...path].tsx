import { NextPage } from "next";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";

import { css } from "../../../styled-system/css";
import { extractAssets, localKey, parseSize } from "@/utils/helpers";
import Folder from "@/components/Folder";
import { useFileStore } from "@/stores/files";
import Gallery from "@/components/Gallery";
import { AssetType, DirectoryType, FileType } from "../../../types";
import { useSettingsStore } from "@/stores/settings";

const DirectoryPage: NextPage = () => {
  const files = useFileStore((state) => state.files);
  const isGridDisplay = useSettingsStore((state) => state.gallery === "grid");
  const filter = useSettingsStore((state) => state.filter);
  const params = useParams();

  const paths = (params?.path || [""]) as string[];
  const isFavoritesDirectory = paths[0] === "favorites";

  const isFirstDirectory = paths.length === 1;

  const directory = useMemo<DirectoryType>(() => {
    if (isFavoritesDirectory) {
      return {
        pathname: "/favorites",
        size: files.length,
        timestamp: 0,
        hash: "fave",
        name: "Favorites",
        type: "directory",
        files: [],
      };
    }

    let directory = files.find(
      (file: FileType) => file.name === paths[0],
    ) as DirectoryType;

    if (isFirstDirectory) return directory;
    const [, ...nextPaths] = paths;

    for (const path of nextPaths) {
      directory = directory.files.find(
        (file) => file.name === path,
      ) as DirectoryType;
    }

    return directory;
  }, [paths, files]);

  const subDirectories = useMemo<{
    filter: DirectoryType[];
    all: DirectoryType[];
  }>(() => {
    const subDirectories: DirectoryType[] = [];

    if (directory.type === "directory") {
      subDirectories.push(
        ...(directory.files.filter(
          (file) => file.type === "directory",
        ) as DirectoryType[]),
      );
    }

    if (filter === "") return { all: subDirectories, filter: subDirectories };

    return {
      filter: subDirectories.filter((directory) =>
        directory.name.toLowerCase().includes(filter.toLowerCase()),
      ),
      all: subDirectories,
    };
  }, [directory, filter]);

  const assets = useMemo<{ images: AssetType[]; videos: AssetType[] }>(() => {
    if (isFavoritesDirectory) {
      const favorites = JSON.parse(
        localStorage.getItem(localKey.FAVORITE) || "[]",
      );
      const assets = files
        .flatMap(extractAssets)
        .filter((asset) => favorites.includes(asset.hash));

      return {
        images: assets.filter((asset) => asset.file === "image"),
        videos: assets.filter((asset) => asset.file === "video"),
      };
    }

    const assets = extractAssets(directory);
    const images: AssetType[] = [];
    const videos: AssetType[] = [];

    for (const asset of assets) {
      if (asset.file === "image") images.push(asset);
      else if (asset.file === "video") videos.push(asset);
    }

    if (isFirstDirectory) return { images, videos };

    return { images, videos };
  }, [directory, isFirstDirectory]);

  const size = useMemo<number>(
    () => directory.files!.reduce((acc, file) => acc + file.size, 0),
    [directory],
  );

  return (
    <div>
      {subDirectories.all.length > 0 && (
        <div>
          <div className={css({ borderBottom: "1px solid", my: 4 })}>
            <h2 className={css({ fontSize: "xl", fontWeight: "medium" })}>
              Folders - {subDirectories.all.length} ({parseSize(size)}){" "}
              {filter && `| Filter: ${subDirectories.filter.length}`}
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
            {subDirectories.filter.map((subDirectory) => (
              <Folder key={subDirectory.hash} directory={subDirectory} />
            ))}
          </div>
        </div>
      )}
      {assets.videos.length > 0 && (
        <Gallery title="Videos" assets={assets.videos} />
      )}
      {assets.images.length > 0 && (
        <Gallery title="Images" assets={assets.images} />
      )}
    </div>
  );
};

export default DirectoryPage;
