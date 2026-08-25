import { useEffect, type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    try { localStorage.setItem("theme", "dark"); } catch {}
  }, []);
  return <>{children}</>;
}

export const useTheme = () => ({ theme: "dark" as const, toggle: () => {} });