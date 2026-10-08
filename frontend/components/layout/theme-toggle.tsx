"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

// Render the same initial state on the server and during client hydration.
function subscribeToHydration() {
  return () => {};
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <Toggle
      type="button"
      pressed={isDark}
      onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
      disabled={!mounted}
      aria-label="Dark theme"
      data-cy="theme-toggle"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="size-11 shrink-0 rounded-full text-foreground hover:bg-foreground/10 aria-pressed:bg-transparent data-[state=on]:bg-transparent data-[state=on]:text-foreground"
    >
      {isDark ? <Sun aria-hidden="true" className="size-5" /> : <Moon aria-hidden="true" className="size-5" />}
    </Toggle>
  );
}
