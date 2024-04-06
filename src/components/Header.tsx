import { css } from "../../styled-system/css";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaChevronLeft, FaSync } from "react-icons/fa";
import { useFileStore } from "@/stores/files";
import { BiLoader } from "react-icons/bi";

export const Header = () => {
  const router = useRouter();
  const store = useFileStore();

  return (
    <div
      className={css({
        position: "fixed",
        sm: {
          top: 4,
          px: 10,
        },
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
          </ul>
          <div
            className={css({
              display: "flex",
              gap: 5,
              justifyContent: "end",
              alignItems: "center",
            })}
          >
            <div
              onClick={() => !store.loading && store.init()}
              className={css({
                color: "white",
                fontSize: "xl",
                cursor: "pointer",
              })}
            >
              {store.loading ? (
                <BiLoader className={css({ animation: "spin" })} />
              ) : (
                <FaSync />
              )}
            </div>
            <h3
              className={css({
                fontSize: "xl",
                color: "white",
                fontWeight: "semibold",
              })}
            >
              Image Viewer
            </h3>
          </div>
        </div>
      </nav>
    </div>
  );
};
