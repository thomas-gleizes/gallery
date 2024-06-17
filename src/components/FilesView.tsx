import React, { useMemo } from "react";
import { useFileStore } from "@/stores/files";
import { useSettingsStore } from "@/stores/settings";
import { AssetType, DirectoryType, FileType } from "../../types";
import {
  deepSort,
  extractAssets,
  getRecentTimestamp,
  localKey,
  randomSort,
} from "@/utils/helpers";
import FolderGallery from "@/components/FolderGallery";
import Gallery from "@/components/Gallery";
import { useDialog } from "react-dialog-promise";
import viewer from "@/components/Viewer";

interface Props {
  paths: string[];
}

const FilesView: React.FC<Props> = ({ paths }) => {
  const files = useFileStore((state) => state.files);
  const filter = useSettingsStore((state) => state.filter);
  const order = useSettingsStore((state) => state.order);

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

    if (paths.length === 0)
      return {
        name: "root",
        type: "directory",
        size: files.map((item) => item.size).reduce((a, b) => a + b, 0),
        files: files,
        hash: "root",
        pathname: "/",
        timestamp: 0,
      };

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

  const orderCallback = useMemo<(a: FileType, b: FileType) => number>(() => {
    switch (order) {
      case "time-ascending":
        return (a, b) => {
          if (a.type === "directory" && b.type === "directory")
            return getRecentTimestamp(a.files) - getRecentTimestamp(b.files);
          return a.timestamp - b.timestamp;
        };
      case "time-descending":
        return (a, b) => {
          if (a.type === "directory" && b.type === "directory")
            return getRecentTimestamp(b.files) - getRecentTimestamp(a.files);
          return b.timestamp - a.timestamp;
        };
      case "alphabetical-z":
        return (a, b) => b.name.localeCompare(a.name);
      case "alphabetical-a":
        return (a, b) => a.name.localeCompare(b.name);
      case "random":
        return () => Math.random() - 0.5;
      default:
        return () => 1;
    }
  }, [order]);

  const subDirectories = useMemo<DirectoryType[]>(() => {
    const subDirectories: DirectoryType[] = [];

    if (directory.type === "directory") {
      subDirectories.push(
        ...(directory.files.filter(
          (file) => file.type === "directory",
        ) as DirectoryType[]),
      );
    }

    for (const subDirectory of subDirectories) {
      subDirectory.files = deepSort(subDirectory.files, orderCallback);
    }

    return subDirectories.sort(orderCallback);
  }, [directory, filter, orderCallback]);

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

    if (order === "random") {
      return {
        images: randomSort(images),
        videos: randomSort(videos),
      };
    }

    return {
      images: images.sort(orderCallback),
      videos: videos.sort(orderCallback),
    };
  }, [directory, isFirstDirectory, orderCallback]);

  const size = useMemo<number>(
    () => directory.files!.reduce((acc, file) => acc + file.size, 0),
    [directory],
  );

  const viewerDialog = useDialog(viewer);

  const handleClick = async () => {
    let assets = extractAssets(directory);

    if (order === "random") {
      assets = randomSort(assets);
    } else {
      assets = assets.sort(orderCallback);
    }

    await viewerDialog.open({
      assets: extractAssets(directory),
      startIndex: 0,
    });
  };

  return (
    <div>
      <div>
        <button onClick={handleClick}>play</button>
      </div>
      <FolderGallery
        title="Folders"
        folders={subDirectories}
        displayEmpty={false}
        activeFilter={true}
        size={size}
        defaultCollapsed={true}
      />
      {assets.videos.length > 0 && (
        <Gallery
          title="Videos"
          assets={assets.videos}
          paginationSuffix="vpage"
          defaultCollapsed={false}
        />
      )}
      {assets.images.length > 0 && (
        <Gallery
          title="Images"
          assets={assets.images}
          paginationSuffix="ipage"
          defaultCollapsed={true}
        />
      )}
    </div>
  );
};

export default FilesView;
