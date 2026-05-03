"use client"

import { useEffect, useState } from "react"

type Theme = "warm" | "cool"

const STORAGE_KEY = "fitore-theme"

function SunIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.9" y1="4.9" x2="6.3" y2="6.3" />
      <line x1="17.7" y1="17.7" x2="19.1" y2="19.1" />
      <line x1="4.9" y1="19.1" x2="6.3" y2="17.7" />
      <line x1="17.7" y1="6.3" x2="19.1" y2="4.9" />
    </svg>
  )
}

function SnowflakeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="3" y1="7" x2="21" y2="17" />
      <line x1="3" y1="17" x2="21" y2="7" />
      <path d="M12 4 L 10 6 M12 4 L 14 6" />
      <path d="M12 20 L 10 18 M12 20 L 14 18" />
      <path d="M4.5 8 L 6 7.5 M4.5 8 L 5 9.7" />
      <path d="M19.5 16 L 18 16.5 M19.5 16 L 19 14.3" />
      <path d="M4.5 16 L 5 14.3 M4.5 16 L 6 16.5" />
      <path d="M19.5 8 L 19 9.7 M19.5 8 L 18 7.5" />
    </svg>
  )
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("warm")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme")
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === "cool" ? "cool" : "warm")
    setMounted(true)
  }, [])

  function toggle() {
    const next: Theme = theme === "warm" ? "cool" : "warm"
    if (next === "cool") {
      document.documentElement.setAttribute("data-theme", "cool")
    } else {
      document.documentElement.removeAttribute("data-theme")
    }
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* noop */
    }
    setTheme(next)
  }

  // Render nothing until we've synced with the DOM — prevents hydration mismatch
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "64px",
          height: "30px",
        }}
      />
    )
  }

  const isCool = theme === "cool"

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isCool}
      aria-label={`Switch to ${isCool ? "warm" : "cool"} mode`}
      className="relative inline-flex items-center"
      style={{
        width: "64px",
        height: "30px",
        borderRadius: "15px",
        padding: "3px",
        backgroundColor: "var(--color-accent)",
        border: "1px solid rgba(246, 220, 159, 0.4)",
        cursor: "pointer",
        transition: "background-color 0.25s ease",
        boxShadow: "var(--shadow-accent-md)",
      }}
    >
      {/* Slider thumb with icon inside */}
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center"
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "var(--color-canvas)",
          color: "var(--color-ink)",
          transform: isCool ? "translateX(34px)" : "translateX(0)",
          transition:
            "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), color 0.25s ease",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.4)",
        }}
      >
        {isCool ? <SnowflakeIcon size={14} /> : <SunIcon size={14} />}
      </span>
    </button>
  )
}
