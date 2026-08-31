export const THEME_EVENT = "themechange";

export function getStoredTheme() {
  try {
    const value = localStorage.getItem("theme");
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function getResolvedTheme() {
  const stored = getStoredTheme();
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme() {
  const stored = getStoredTheme();
  const root = document.documentElement;
  if (stored) root.setAttribute("data-theme", stored);
  else root.removeAttribute("data-theme");
}

export function setTheme(theme) {
  try {
    if (theme) localStorage.setItem("theme", theme);
    else localStorage.removeItem("theme");
  } catch {
    /* storage unavailable — fall through and still apply for this session */
  }
  applyTheme();
  window.dispatchEvent(new Event(THEME_EVENT));
}

export function subscribeTheme(callback) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => callback(getResolvedTheme());
  window.addEventListener(THEME_EVENT, handler);
  media.addEventListener("change", handler);
  return () => {
    window.removeEventListener(THEME_EVENT, handler);
    media.removeEventListener("change", handler);
  };
}
