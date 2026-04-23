"use client"

import { useEffect, useState } from "react"

type Theme = "warm" | "cool"

const STORAGE_KEY = "martialops-theme"

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("warm")
  const [mounted, setMounted] = useState(false)

  // On mount, read from DOM (set by no-flash script) and sync state
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme")
    setTheme(current === "cool" ? "cool" : "warm")
    setMounted(true)
  }, [])

  function apply(next: Theme) {
    if (next === "cool") {
      document.documentElement.setAttribute("data-theme", "cool")
    } else {
      document.documentElement.removeAttribute("data-theme")
    }
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // localStorage may be disabled; fail silently
    }
    setTheme(next)
  }

  function baseStyle(active: boolean): React.CSSProperties {
    return {
      fontFamily: "var(--font-mono)",
      fontSize: "10px",
      fontWeight: 600,
      letterSpacing: "0.24em",
      textTransform: "uppercase",
      padding: "4px 10px",
      backgroundColor: active ? "var(--color-ink)" : "transparent",
      color: active ? "var(--color-canvas)" : "var(--color-ink)",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.2s ease, color 0.2s ease",
    }
  }

  return (
    <div
      className="flex items-stretch"
      style={{
        border: "1px solid var(--color-rule-strong)",
        // avoid mismatch flicker between server render and mount
        visibility: mounted ? "visible" : "hidden",
      }}
      aria-label="Theme toggle"
      role="group"
    >
      <button
        type="button"
        onClick={() => apply("warm")}
        aria-pressed={theme === "warm"}
        style={baseStyle(theme === "warm")}
      >
        Warm
      </button>
      <button
        type="button"
        onClick={() => apply("cool")}
        aria-pressed={theme === "cool"}
        style={baseStyle(theme === "cool")}
      >
        Cool
      </button>
    </div>
  )
}
