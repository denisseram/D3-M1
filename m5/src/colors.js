import { useEffect, useState } from "react";

// Single-hue sequential ramp (blue), light -> dark, for magnitude encodings
// (the heatmap). A separate dark-surface ramp keeps the low end from
// disappearing into a dark background while the high end stays bright.
export const SEQUENTIAL_RAMP = {
  light: [
    "#f0f6fd",
    "#cde2fb",
    "#9ec5f4",
    "#6da7ec",
    "#3987e5",
    "#256abf",
    "#104281",
  ],
  dark: [
    "#20242b",
    "#1f3a52",
    "#1f5079",
    "#2266a0",
    "#2a78d6",
    "#3987e5",
    "#7ab6f2",
  ],
};

export const usePrefersDark = () => {
  const [isDark, setIsDark] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setIsDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isDark;
};
