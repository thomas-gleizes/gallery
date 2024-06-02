import { css } from "../../styled-system/css";
import Folder from "@/components/Folder";
import React, { useMemo } from "react";
import { DirectoryType } from "../../types";
import { useSettingsStore } from "@/stores/settings";
import { parseSize } from "@/utils/helpers";
import Collapse from "@/components/Collapse";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useToggle } from "react-use";
import PageIndicator from "@/components/PageIndicator";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  title: string;
  folders: DirectoryType[];
  displayEmpty: boolean;
  activeFilter: boolean;
  size?: number;
  pagination?: string;
  defaultCollapsed?: boolean;
}

const PAGE_LENGTH = 24;

const FolderGallery: React.FC<Props> = ({
  title,
  folders,
  displayEmpty = false,
  activeFilter = false,
  size,
  pagination,
  defaultCollapsed = false,
}) => {
  const [isOpen, toggleOpen] = useToggle(defaultCollapsed);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageIndex: number =
    pagination && parseInt(searchParams.get(pagination) || "")
      ? parseInt(searchParams.get(pagination)!)
      : 0;

  const filter = useSettingsStore((state) => state.filter);

  const filterFolders = useMemo(() => {
    if (activeFilter)
      return folders.filter((folder) =>
        folder.name.toLowerCase().includes(filter),
      );

    return folders;
  }, [folders, filter, activeFilter]);

  const displayFolders = pagination
    ? filterFolders.slice(
        pageIndex * PAGE_LENGTH,
        (pageIndex + 1) * PAGE_LENGTH,
      )
    : filterFolders;

  if (folders.length === 0 && !displayEmpty) return null;

  return (
    <div>
      <div
        className={css({
          borderBottom: "1px solid",
          my: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        <h2 className={css({ fontSize: "xl", fontWeight: "medium" })}>
          {title} - {folders.length} {size && `(${parseSize(size)})`}
          {filter && `| Filter: ${filterFolders.length}`}
        </h2>
        <div
          className={css({
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            gap: 2,
          })}
        >
          <div
            onClick={() => toggleOpen()}
            className={css({ pr: 3, cursor: "pointer" })}
          >
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {pagination && (
            <PageIndicator
              currentPage={pageIndex}
              totalPages={filterFolders.length / PAGE_LENGTH}
              pathname={pathname}
              paramKey={pagination}
            />
          )}
        </div>
      </div>
      <Collapse isOpen={isOpen}>
        <div
          className={css({
            display: "flex",
            flexWrap: "wrap",
            justifyItems: "center",
            justifyContent: "center",
            gap: 5,
          })}
        >
          {displayFolders.filter.length ? (
            displayFolders.map((folder) => (
              <Folder key={folder.hash} directory={folder} />
            ))
          ) : (
            <div>No folders</div>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default FolderGallery;
