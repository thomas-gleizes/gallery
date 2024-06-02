import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { FaArrowDown, FaArrowUp, FaChevronLeft, FaSync } from "react-icons/fa";
import { FaA, FaZ } from "react-icons/fa6";

import { css } from "../../styled-system/css";
import { useFileStore } from "@/stores/files";
import { BiLoader } from "react-icons/bi";
import { useSettingsStore } from "@/stores/settings";

export const Header = () => {
  const router = useRouter();
  const [isLoading, init] = useFileStore((state) => [
    state.loading,
    state.init,
  ]);
  const [galleryDisplay, toggleGallery] = useSettingsStore((state) => [
    state.gallery,
    state.toggleGallery,
  ]);
  const [filter, setFilter] = useSettingsStore((state) => [
    state.filter,
    state.setFilter,
  ]);
  const [order, toggleOrder] = useSettingsStore((state) => [
    state.order,
    state.toggleOrder,
  ]);

  return (
    <div
      className={css({
        position: "fixed",
        sm: { top: 4, px: 10 },
        top: 0,
        width: "100%",
        zIndex: 10,
      })}
    >
      <nav
        className={css({
          bgColor: "blue.700",
          px: 5,
          py: 3,
          sm: { rounded: "md" },
          shadow: "lg",
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          })}
        >
          <ul
            className={css({
              display: "flex",
              alignItems: "center",
              sm: { gap: 10 },
              gap: 2,
            })}
          >
            <li>
              <FaChevronLeft
                onClick={() => router.back()}
                className={css({ color: "white", cursor: "pointer" })}
              />
            </li>
            <li>
              <Link
                href="/"
                className={css({
                  fontSize: "xl",
                  color: "white",
                  fontWeight: "semibold",
                })}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/random"
                className={css({
                  fontSize: "xl",
                  color: "white",
                  fontWeight: "semibold",
                })}
              >
                Random
              </Link>
            </li>
            <li>
              <Link
                href="/latest"
                className={css({
                  fontSize: "xl",
                  color: "white",
                  fontWeight: "semibold",
                })}
              >
                Latest
              </Link>
            </li>
            <li>
              <Link
                href="/search"
                className={css({
                  fontSize: "xl",
                  color: "white",
                  fontWeight: "semibold",
                })}
              >
                Search
              </Link>
            </li>
          </ul>
          <div
            className={css({
              display: "flex",
              gap: 5,
              justifyContent: "end",
              alignItems: "center",
            })}
          >
            <div>
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                type="text"
                placeholder="Search"
                className={css({
                  bgColor: "white",
                  color: "black",
                  border: "none",
                  px: 3,
                  py: 2,
                  rounded: "md",
                })}
              />
            </div>
            <button
              onClick={() => !isLoading && init(true)}
              className={css({
                color: "white",
                fontSize: "xl",
                cursor: "pointer",
              })}
            >
              {isLoading ? (
                <BiLoader className={css({ animation: "spin" })} />
              ) : (
                <FaSync />
              )}
            </button>
            <button
              onClick={() => toggleOrder()}
              className={css({
                color: "white",
                fontSize: "xl",
                cursor: "pointer",
                display: "flex",
                gap: 2,
              })}
            >
              {order === "time-ascending" ? (
                <FaArrowUp />
              ) : order === "time-descending" ? (
                <FaArrowDown />
              ) : order === "alphabetical-a" ? (
                <FaA />
              ) : (
                <FaZ />
              )}
            </button>
            <h3
              className={css({
                fontSize: "xl",
                color: "white",
                fontWeight: "semibold",
              })}
            >
              Gallery
            </h3>
          </div>
        </div>
      </nav>
    </div>
  );
};
