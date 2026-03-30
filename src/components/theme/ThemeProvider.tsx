"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import {
  ThemeContext,
  THEMES,
  DEFAULT_THEME,
  type Theme,
} from "@/hooks/useTheme";

const STORAGE_KEY = "nextconnect-theme";

const DARK_THEMES = new Set<Theme>([
  "gruvbox-dark",
  "nord-dark",
  "everforest-dark",
  "catppuccin-mocha",
]);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && (THEMES as readonly string[]).includes(stored)) {
        setThemeState(stored);
        document.documentElement.setAttribute("data-theme", stored);
      }
    } catch {
      /* localStorage unavailable (iframe restrictions, privacy mode) */
    }
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isDark: DARK_THEMES.has(theme) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
