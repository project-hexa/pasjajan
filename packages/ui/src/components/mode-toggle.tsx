"use client";

import { useTheme } from "next-themes";
import { ThemeSwitcher } from "./shadcnio/theme-switcher"

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themeValue =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : undefined;
  return (
    <ThemeSwitcher value={themeValue} onChange={setTheme} />
  )
}
