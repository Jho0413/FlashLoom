"use client";

import { useEffect, useState } from "react";
import { getResolvedTheme, setTheme, subscribeTheme } from "@/utils/theme";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export default function ThemeToggle({ className = "" }) {
  const [theme, setThemeState] = useState(null);

  useEffect(() => {
    setThemeState(getResolvedTheme());
    return subscribeTheme(setThemeState);
  }, []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      className={`flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-ink-muted transition-colors hover:border-hairline-strong hover:text-ink ${className}`}
    >
      {theme === null ? <span className="h-4 w-4" /> : isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
