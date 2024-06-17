import React, { FocusEventHandler, useState } from "react";
import { useSettingsStore } from "@/stores/settings";
import { css } from "../../styled-system/css";

const InputDelay: React.FC = () => {
  const [delay, setDelay] = useSettingsStore((state) => [
    state.viewerDelay,
    state.setViewerDelay,
  ]);

  const [value, setValue] = useState<string>((delay / 1000).toFixed(2));

  const handleBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    if (
      isNaN(parseFloat(event.target.value)) ||
      parseFloat(event.target.value) < 0.1
    ) {
      return setValue((delay / 1000).toFixed(2));
    }

    setDelay(parseFloat(event.target.value) * 1000);
  };

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleBlur}
      className={css({
        rounded: "sm",
        px: 2,
        height: 8,
        w: 16,
        bgColor: "rgba(255, 255, 255, 0.5)",
        border: "1px solid white",
        textAlign: "right",
      })}
    />
  );
};

export default InputDelay;
