import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";

export function useTheme() {
  const theme = useChatStore((s) => s.theme);
  const toggleTheme = useChatStore((s) => s.toggleTheme);
  const setTheme = useChatStore((s) => s.setTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return { theme, toggleTheme, setTheme };
}
