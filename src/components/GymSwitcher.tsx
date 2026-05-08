"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { setActiveGym } from "@/app/actions/active-gym"

type Membership = {
  gymId: string
  role: "ATHLETE" | "COACH" | "ADMIN"
  gym: { id: string; name: string }
}

type Props = {
  active: Membership
  all: Membership[]
}

type Coords = { top: number; left: number; width: number }

export default function GymSwitcher({ active, all }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState<Coords | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    function update() {
      if (!buttonRef.current) return
      const r = buttonRef.current.getBoundingClientRect()
      setCoords({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 220) })
    }
    update()
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [open])

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node | null
      if (!target) return
      if (buttonRef.current?.contains(target)) return
      if (dropdownRef.current?.contains(target)) return
      setOpen(false)
    }
    if (open) document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [open])

  async function handleSwitch(gymId: string) {
    if (gymId === active.gymId) {
      setOpen(false)
      return
    }
    setPending(true)
    try {
      const res = await setActiveGym(gymId)
      if (res.ok) {
        setOpen(false)
        router.refresh()
      }
    } finally {
      setPending(false)
    }
  }

  if (all.length <= 1) {
    return (
      <div
        className="hidden items-center lg:flex"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--color-canvas)",
          opacity: 0.65,
        }}
      >
        <span>{active.gym.name}</span>
      </div>
    )
  }

  return (
    <div className="relative hidden lg:block">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="flex items-center gap-2 px-2 py-2 text-[10px] tracking-[0.14em] transition-opacity hover:opacity-100 xl:px-3 xl:text-[11px] xl:tracking-[0.18em]"
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 500,
          textTransform: "uppercase",
          color: "var(--color-canvas)",
          opacity: open ? 1 : 0.85,
          border: "1px solid rgba(246, 220, 159, 0.18)",
        }}
      >
        <span>{active.gym.name}</span>
        <span
          aria-hidden="true"
          style={{
            color: "var(--color-accent-bright)",
            fontSize: "9px",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </button>

      {mounted && open && coords &&
        createPortal(
          <div
            ref={dropdownRef}
            className="border"
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              minWidth: "220px",
              zIndex: 1000,
              backgroundColor: "var(--color-ink)",
              borderColor: "rgba(246, 220, 159, 0.22)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            {all.map((m) => {
              const isActive = m.gymId === active.gymId
              return (
                <button
                  key={m.gymId}
                  type="button"
                  onClick={() => handleSwitch(m.gymId)}
                  className="flex w-full items-center justify-between px-3 py-3 text-left transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: isActive
                      ? "var(--color-accent-bright)"
                      : "var(--color-canvas)",
                    opacity: isActive ? 1 : 0.8,
                    borderBottom: "1px solid rgba(246, 220, 159, 0.08)",
                  }}
                >
                  <span>{m.gym.name}</span>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      color: isActive
                        ? "var(--color-accent-bright)"
                        : "rgba(246, 220, 159, 0.45)",
                    }}
                  >
                    {isActive ? "● " : ""}
                    {m.role}
                  </span>
                </button>
              )
            })}
            <Link
              href="/onboarding"
              onClick={() => setOpen(false)}
              className="block px-3 py-3 transition-colors"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--color-accent-bright)",
                backgroundColor: "rgba(0,0,0,0.18)",
              }}
            >
              + Join another gym
            </Link>
          </div>,
          document.body,
        )}
    </div>
  )
}
