import { NextPage } from "next";
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";

import { useFileStore } from "@/stores/files";
import { css } from "../../styled-system/css";
import { AssetType, DirectoryType, FileType } from "../../types";
import Gallery from "@/components/Gallery";
import { extractAssets } from "@/utils/helpers";
import FolderGallery from "@/components/FolderGallery";
import { useSettingsStore } from "@/stores/settings";

type Result = {
  folders: DirectoryType[];
  subFolders: DirectoryType[];
  files: AssetType[];
};

const SearchPage: NextPage = () => {
  const files = useFileStore((state) => state.files);
  const [storeQuery, setStoreQuery] = useSettingsStore((state) => [
    state.searchQuery,
    state.setSearchQuery,
  ]);

  const [query, setQuery] = useState<string>(storeQuery);
  const handleQuery: ChangeEventHandler<HTMLInputElement> = (e) =>
    setQuery(e.target.value);

  const handleKey: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      search();
    }
  };

  const [result, setResult] = useState<Result>({
    folders: [],
    subFolders: [],
    files: [],
  });

  const extractSubFolders = (files: FileType[]): DirectoryType[] => {
    const subFolders: DirectoryType[] = [];

    for (const file of files) {
      if (file.type === "directory") {
        subFolders.push(file);
        subFolders.push(...extractSubFolders(file.files));
      }
    }

    return subFolders;
  };

  const searchFolder = (query: string) => {
    const result: Result = { folders: [], subFolders: [], files: [] };

    if (query === "") return result;

    result.folders = files.filter((file) =>
      file.name.toLowerCase().includes(query),
    ) as DirectoryType[];

    for (const file of files) {
      if (file.type === "directory")
        result.subFolders.push(
          ...extractSubFolders(file.files).filter(
            (file) =>
              file.name.toLowerCase().includes(query) ||
              file.pathname.toLowerCase().includes(query),
          ),
        );
    }

    result.files = files
      .map(extractAssets)
      .flat()
      .filter(
        (file) =>
          file.name.toLowerCase().includes(query) ||
          file.url.toLowerCase().includes(query),
      );

    setResult(result);
  };

  const search = () => {
    setStoreQuery(query);
    searchFolder(query.toLowerCase());
  };

  useEffect(() => {
    searchFolder(query);
  }, []);

  return (
    <>
      <div>
        <div
          className={css({
            mt: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <div>
            <h2 className={css({ fontSize: "xl" })}>Search : </h2>
          </div>
          <input
            onKeyDown={handleKey}
            className={css({
              border: "1px black",
              bgColor: "gray.50",
              rounded: "sm",
              px: 4,
              py: 2,
              fontSize: "xl",
            })}
            placeholder="Tape ou search here"
            value={query}
            onChange={handleQuery}
            onBlur={search}
          />
        </div>
      </div>
      <FolderGallery
        folders={result.folders}
        activeFilter={true}
        displayEmpty={true}
        title="Folders"
      />
      <FolderGallery
        folders={result.subFolders}
        activeFilter={true}
        displayEmpty={true}
        title="Sub Folders"
      />

      <Gallery assets={result.files} title="Files" />
    </>
  );
};

export default SearchPage;
