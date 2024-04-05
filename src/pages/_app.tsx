import { AppProps } from "next/app";
import { usePathname } from "next/navigation";
import { DialogProvider } from "react-dialog-promise";
import React, { useEffect } from "react";

import "@/styles/globals.css";
import { css } from "../../styled-system/css";
import { Header } from "@/components/Header";
import { useFileStore } from "@/stores/files";
import { localKey } from "@/utils/helpers";

export default function MyApp({ Component, pageProps }: AppProps) {
  const pathname = usePathname();

  const init = useFileStore((state) => state.init);
  const ready = useFileStore((state) => state.ready);
  const loading = useFileStore((state) => state.loading);

  function scrollTop() {
    window &&
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
  }

  useEffect(() => void init(), []);

  useEffect(() => {
    if (window && !localStorage.getItem(localKey.favorite)) {
      localStorage.setItem(localKey.favorite, JSON.stringify([]));
    }
  }, []);

  useEffect(() => window && scrollTop(), [pathname]);

  if (loading && !ready) return <div>Loading...</div>;
  if (!loading && !ready) return <div>Error</div>;

  return (
    <DialogProvider>
      <Header />
      <main
        className={css({
          position: "absolute",
          top: 20,
          width: "100%",
          px: 10,
          pb: "200px",
        })}
      >
        <Component {...pageProps} />
      </main>
      <div
        onClick={scrollTop}
        className={css({
          width: 10,
          height: 10,
          bgColor: "white",
          shadow: "xl",
          rounded: "md",
          border: ".2px gray solid",
          position: "fixed",
          bottom: 10,
          right: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        })}
      >
        Top
      </div>
    </DialogProvider>
  );
}
