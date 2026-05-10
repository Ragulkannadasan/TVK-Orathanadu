"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2.5 rounded-xl bg-surface-border/10 border border-surface-border text-foreground hover:bg-surface-border/20 hover:border-accent transition-all duration-300 shadow-sm"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-gold animate-in fade-in zoom-in duration-300" />
      ) : (
        <Moon size={20} className="text-maroon animate-in fade-in zoom-in duration-300" />
      )}
    </button>
  );
}
