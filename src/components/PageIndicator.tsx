import React from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { css } from "../../styled-system/css";
import { useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
  pathname: string;
  paramKey: string;
}

const PageIndicator: React.FC<Props> = ({
  currentPage,
  totalPages,
  pathname,
  paramKey,
}) => {
  const searchParams = useSearchParams();

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  nextSearchParams.set(paramKey, `${currentPage + 1}`);

  const prevSearchParams = new URLSearchParams(searchParams.toString());
  prevSearchParams.set(paramKey, `${currentPage - 1}`);

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
        <Link href={`${pathname}?${prevSearchParams.toString()}`}>
          <FaChevronLeft />
        </Link>
      ) : (
        <FaChevronLeft className={css({ opacity: 0.2 })} />
      )}
      <div>
        {currentPage + 1} / {Math.floor(totalPages) + 1}
      </div>
      {currentPage + 1 < totalPages ? (
        <Link href={`${pathname}?${nextSearchParams.toString()}`}>
          <FaChevronRight />
        </Link>
      ) : (
        <FaChevronRight className={css({ opacity: 0.2 })} />
      )}
    </div>
  );
};

export default PageIndicator;
