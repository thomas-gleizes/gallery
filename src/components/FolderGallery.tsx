import { css } from "../../styled-system/css";
import Folder from "@/components/Folder";
import React, { useMemo } from "react";
import { DirectoryType } from "../../types";
import { useSettingsStore } from "@/stores/settings";
import { parseSize } from "@/utils/helpers";

interface Props {
  title: string;
  folders: DirectoryType[];
  displayEmpty: boolean;
  activeFilter: boolean;
  size?: number;
}

const FolderGallery: React.FC<Props> = ({
  title,
  folders,
  displayEmpty = false,
  activeFilter = false,
  size,
}) => {
  const filter = useSettingsStore((state) => state.filter);

  const filterFolders = useMemo(() => {
    if (activeFilter)
      return folders.filter((folder) =>
        folder.name.toLowerCase().includes(filter),
      );

    return folders;
  }, [folders, filter, activeFilter]);

  if (folders.length === 0 && !displayEmpty) return null;

  return (
    <div>
      <div className={css({ borderBottom: "1px solid", my: 4 })}>
        <h2 className={css({ fontSize: "xl", fontWeight: "medium" })}>
          {title} - {folders.length} {size && `(${parseSize(size)})`}
          {filter && `| Filter: ${filterFolders.length}`}
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
        {filterFolders.filter.length ? (
          filterFolders.map((folder) => (
            <Folder key={folder.hash} directory={folder} />
          ))
        ) : (
          <div>No folders</div>
        )}
      </div>
    </div>
  );
};

export default FolderGallery;
