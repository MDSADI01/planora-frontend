"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: "light" | "dark";
  systemTheme?: "light" | "dark";
  themes: Theme[];
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "system",
  setTheme: () => {},
  themes: ["light", "dark", "system"],
});

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  /** Accepted for API compatibility — always uses "class" attribute */
  attribute?: string;
  /** Accepted for API compatibility */
  enableSystem?: boolean;
  /** Accepted for API compatibility */
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<
    "light" | "dark" | undefined
  >(undefined);
  const [systemTheme, setSystemTheme] = React.useState<
    "light" | "dark" | undefined
  >(undefined);

  // Resolve the actual class ("light" or "dark") from a given theme
  const resolve = React.useCallback(
    (t: Theme, sysOverride?: "light" | "dark"): "light" | "dark" => {
      if (t !== "system") return t;
      if (sysOverride) return sysOverride;
      if (typeof window === "undefined") return "light";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    },
    []
  );

  // Apply class + colorScheme to <html>
  const applyTheme = React.useCallback(
    (t: Theme, sysOverride?: "light" | "dark") => {
      const root = document.documentElement;
      const resolved = resolve(t, sysOverride);
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.style.colorScheme = resolved;
      setResolvedTheme(resolved);
    },
    [resolve]
  );

  // Read persisted theme on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      if (stored) setThemeState(stored);
    } catch {}
  }, [storageKey]);

  // Watch system preference
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      const sys: "light" | "dark" = e.matches ? "dark" : "light";
      setSystemTheme(sys);
      setThemeState((current) => {
        if (current === "system") applyTheme("system", sys);
        return current;
      });
    };
    update(mq);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [applyTheme]);

  // Apply whenever theme changes
  React.useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = React.useCallback(
    (t: Theme) => {
      setThemeState(t);
      try {
        localStorage.setItem(storageKey, t);
      } catch {}
    },
    [storageKey]
  );

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        systemTheme,
        themes: ["light", "dark", "system"],
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/** Drop-in replacement for next-themes' useTheme */
export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}