import React from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { css } from "../../styled-system/css";

interface Props {
  currentPage: number;
  totalPages: number;
  pathname: string;
}

const PageIndicator: React.FC<Props> = ({
  currentPage,
  totalPages,
  pathname,
}) => {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      })}
    >
      {currentPage > 0 ? (
        <Link href={`${pathname}?page=${currentPage - 1}`}>
          <FaChevronLeft />
        </Link>
      ) : (
        <FaChevronLeft className={css({ opacity: 0.2 })} />
      )}
      <div>
        {currentPage + 1} / {Math.floor(totalPages) + 1}
      </div>
      {currentPage + 1 < totalPages ? (
        <Link href={`${pathname}?page=${currentPage + 1}`}>
          <FaChevronRight />
        </Link>
      ) : (
        <FaChevronRight className={css({ opacity: 0.2 })} />
      )}
    </div>
  );
};

export default PageIndicator;
