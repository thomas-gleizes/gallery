import { css } from "../../styled-system/css";
import Link from "next/link";

export const Header = () => {
  return (
    <header
      className={css({
        position: "fixed",
        width: "100%",
        px: 10,
        top: 4,
        zIndex: 10,
      })}
    >
      <nav
        className={css({
          bgColor: "blue.700",
          px: 5,
          py: 3,
          rounded: "md",
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
          <ul className={css({ display: "flex", gap: 10 })}>
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
          <div>
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
    </header>
  );
};
