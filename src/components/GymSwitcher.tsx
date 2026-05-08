"use client"

import { useEffect, useRef, useState } from "react"
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

export default function GymSwitcher({ active, all }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false)
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
    const res = await setActiveGym(gymId)
    setPending(false)
    setOpen(false)
    if (res.ok) router.refresh()
  }

  if (all.length <= 1) {
    return (
      <div
        className="hidden items-center md:flex"
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
    <div ref={wrapperRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="flex items-center gap-2 px-3 py-2 transition-opacity hover:opacity-100"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
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

      {open && (
        <div
          className="absolute left-0 right-0 z-50 mt-1 min-w-[220px] border"
          style={{
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
        </div>
      )}
    </div>
  )
}
