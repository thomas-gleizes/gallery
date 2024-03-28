import { NextPage } from "next";
import React, { useMemo } from "react";
import { useParams } from "next/navigation";

import { css } from "../../../styled-system/css";
import { extractAssets } from "@/utils/helpers";
import Folder from "@/components/Folder";
import { useFileStore } from "@/stores/files";
import Gallery from "@/components/Gallery";
import { AssetType, DirectoryType, FileType } from "../../../types";

const DirectoryPage: NextPage = () => {
  const files = useFileStore((state) => state.files);
  const params = useParams();

  const paths = params.path as string[];

  const isFirstDirectory = paths.length === 1;

  const directory = useMemo<AssetType | DirectoryType>(() => {
    let directory = files.find(
      (file: FileType) => file.name === paths[0],
    ) as DirectoryType;

    if (isFirstDirectory) return directory;
    const [, ...nexTpaths] = paths;

    for (const path of nexTpaths) {
      directory = directory.files.find(
        (file) => file.name === path,
      ) as DirectoryType;
    }

    return directory;
  }, [paths, files]);

  const subDirectories = useMemo<DirectoryType[]>(() => {
    if (directory.type === "directory") {
      return directory.files.filter(
        (file) => file.type === "directory",
      ) as DirectoryType[];
    } else return [];
  }, [directory]);

  const assets = useMemo<{ images: AssetType[]; videos: AssetType[] }>(() => {
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

  return (
    <div>
      {subDirectories.length > 0 && (
        <div>
          <div className={css({ borderBottom: "1px solid", my: 4 })}>
            <h2 className={css({ fontSize: "xl", fontWeight: "medium" })}>
              Folders - {subDirectories.length}
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
            {subDirectories.map((subDirectory) => (
              <Folder
                key={subDirectory.hash}
                directory={subDirectory}
                isHomePage={false}
              />
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
