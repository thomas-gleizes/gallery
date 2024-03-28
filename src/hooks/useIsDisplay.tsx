import { RefObject, useEffect, useRef, useState } from "react";
import { useEvent } from "react-use";

function elementIsDisplay(element: Element, marge: number): boolean {
  const rect = element.getBoundingClientRect();

  const height = window.innerHeight || document.documentElement.clientHeight;
  const topScreen = height * marge;
  const bottomScreen = height - topScreen;

  return rect.top < topScreen && rect.bottom > bottomScreen;
}

export function useIsDisplay<E extends Element>(
  marge: number = 1,
  elementRef?: RefObject<E>,
): [boolean, RefObject<E>] {
  const internalRef = useRef<E>(null);

  const ref = elementRef ?? internalRef;

  const [isDisplay, setIsDisplay] = useState<boolean>(
    ref.current ? elementIsDisplay(ref.current, marge) : false,
  );

  function handler(): void {
    console.log("handler", ref.current);
    if (ref.current) {
      const display = elementIsDisplay(ref.current, marge);
      if (display !== isDisplay) setIsDisplay(display);
    }
  }

  useEffect(() => void setTimeout(handler, 1000), []);

  useEffect(() => {
    if (!window) return;

    document.body.addEventListener("scroll", handler);

    return () => document.body.removeEventListener("scroll", handler);
  }, []);

  return [isDisplay, ref];
}
