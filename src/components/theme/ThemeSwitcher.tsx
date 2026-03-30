"use client";

import { useTheme, THEMES, type Theme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Paintbrush, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const THEME_LABELS: Record<Theme, string> = {
  "gruvbox-light": "Gruvbox Light",
  "gruvbox-dark": "Gruvbox Dark",
  "nord-light": "Nord Light",
  "nord-dark": "Nord Dark",
  "everforest-light": "Everforest Light",
  "everforest-dark": "Everforest Dark",
  "catppuccin-latte": "Catppuccin Latte",
  "catppuccin-mocha": "Catppuccin Mocha",
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (open && panelRef.current) {
      const active = panelRef.current.querySelector("[data-active]") as HTMLElement | null;
      active?.focus();
    }
  }, [open]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label="Switch theme"
        aria-expanded={open}
      >
        <Paintbrush className="h-4 w-4" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            role="listbox"
            aria-label="Theme selection"
            className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg border border-border bg-card p-1 shadow-lg"
          >
            {THEMES.map((t) => {
              const active = theme === t;
              return (
                <button
                  key={t}
                  role="option"
                  aria-selected={active}
                  data-active={active || undefined}
                  tabIndex={0}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => {
                    setTheme(t);
                    setOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setTheme(t);
                      setOpen(false);
                    }
                  }}
                >
                  <span>{THEME_LABELS[t]}</span>
                  {active && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
