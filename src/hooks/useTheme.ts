"use client";

import { createContext, useContext } from "react";

export const THEMES = [
  "gruvbox-light",
  "gruvbox-dark",
  "nord-light",
  "nord-dark",
  "everforest-light",
  "everforest-dark",
  "catppuccin-latte",
  "catppuccin-mocha",
] as const;

export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = "gruvbox-light";

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  isDark: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}
