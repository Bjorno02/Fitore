"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { useRouter } from "next/navigation"
import { setActiveGym } from "@/app/actions/active-gym"
import ThemeToggle from "./ThemeToggle"
import SignOutButton from "./SignOutButton"
import { DoubleHeadedEagle, MarkedRule } from "./Ornaments"

type NavLink = { href: string; label: string; num: string }

type Membership = {
  gymId: string
  role: "ATHLETE" | "COACH" | "ADMIN"
  gym: { id: string; name: string }
}

type Props = {
  links: NavLink[]
  active: Membership | null
  all: Membership[]
}

export default function MobileNav({ links, active, all }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pendingGym, setPendingGym] = useState<string | null>(null)
  const router = useRouter()
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
      if (e.key !== "Tab") return
      const drawer = closeRef.current?.closest('[role="dialog"]') as HTMLElement | null
      if (!drawer) return
      const focusables = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const activeEl = document.activeElement as HTMLElement | null
      if (e.shiftKey && activeEl === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => closeRef.current?.focus(), 50)
      return () => window.clearTimeout(id)
    }
    if (mounted) hamburgerRef.current?.focus()
  }, [open, mounted])

  async function handleSwitch(gymId: string) {
    if (active && gymId === active.gymId) {
      setOpen(false)
      return
    }
    setPendingGym(gymId)
    try {
      const res = await setActiveGym(gymId)
      if (res.ok) {
        setOpen(false)
        router.refresh()
      }
    } finally {
      setPendingGym(null)
    }
  }

  return (
    <>
      <button
        ref={hamburgerRef}
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center lg:hidden"
        style={{
          width: "44px",
          height: "44px",
          marginLeft: "-12px",
          color: "var(--color-accent-bright)",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <path
            d="M3 6 H21"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
          <path
            d="M3 12 H21"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
          <path
            d="M3 18 H15"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-[60]"
                  style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                  aria-hidden="true"
                />
                <motion.aside
                  key="drawer"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Navigation"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="z-[70] flex flex-col"
                  style={{
                    position: "fixed",
                    inset: 0,
                    height: "100vh",
                    width: "100vw",
                    maxWidth: "100vw",
                    background:
                      "linear-gradient(180deg, var(--color-ink) 0%, var(--color-ink-deepest) 100%)",
                    color: "var(--color-canvas)",
                    boxShadow: "var(--shadow-lg)",
                    borderRight: "1px solid rgba(246, 220, 159, 0.18)",
                  }}
                >
                  <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "var(--color-canvas)",
                        opacity: 0.85,
                      }}
                    >
                      <span style={{ color: "var(--color-accent-bright)" }}>
                        [
                      </span>
                      The Index
                      <span style={{ color: "var(--color-accent-bright)" }}>
                        ]
                      </span>
                    </span>
                    <button
                      ref={closeRef}
                      type="button"
                      aria-label="Close navigation"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center"
                      style={{
                        width: "44px",
                        height: "44px",
                        marginRight: "-12px",
                        color: "var(--color-accent-bright)",
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M5 5 L19 19 M19 5 L5 19"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="square"
                        />
                      </svg>
                    </button>
                  </div>

                  <MarkedRule
                    color="var(--color-accent)"
                    markColor="var(--color-canvas)"
                    thickness={2}
                    markSize={6}
                  />

                  <nav className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
                    <ul className="flex flex-col gap-1">
                      {links.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className="flex items-baseline gap-4 py-3"
                            style={{
                              fontFamily: "var(--font-barlow)",
                              fontWeight: 700,
                              fontSize: "20px",
                              letterSpacing: "0.04em",
                              textTransform: "uppercase",
                              color: "var(--color-canvas)",
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                                fontWeight: 500,
                                letterSpacing: "0.18em",
                                color: "var(--color-accent-bright)",
                                minWidth: "32px",
                              }}
                            >
                              § {l.num}
                            </span>
                            <span>{l.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {active && (
                      <>
                        <div
                          className="mt-8 mb-3"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            fontWeight: 600,
                            letterSpacing: "0.22em",
                            textTransform: "uppercase",
                            color: "var(--color-ink-faint)",
                            opacity: 0.65,
                          }}
                        >
                          Active Gym
                        </div>
                        <div className="flex flex-col gap-1">
                          {all.map((m) => {
                            const isActive = m.gymId === active.gymId
                            return (
                              <button
                                key={m.gymId}
                                type="button"
                                onClick={() => handleSwitch(m.gymId)}
                                disabled={pendingGym !== null}
                                className="flex items-center justify-between py-3 text-left"
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "13px",
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  color: isActive
                                    ? "var(--color-accent-bright)"
                                    : "var(--color-canvas)",
                                  opacity: isActive ? 1 : 0.78,
                                }}
                              >
                                <span>{m.gym.name}</span>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    letterSpacing: "0.2em",
                                    opacity: isActive ? 1 : 0.55,
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
                            className="mt-2 py-3"
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "12px",
                              letterSpacing: "0.16em",
                              textTransform: "uppercase",
                              color: "var(--color-accent-bright)",
                            }}
                          >
                            + Join another gym
                          </Link>
                        </div>
                      </>
                    )}
                  </nav>

                  <MarkedRule
                    color="var(--color-accent)"
                    markColor="var(--color-canvas)"
                    thickness={2}
                    markSize={6}
                  />

                  <div className="flex items-center justify-between px-6 py-5">
                    <ThemeToggle />
                    <SignOutButton />
                  </div>

                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute"
                    style={{
                      bottom: "16px",
                      right: "16px",
                      opacity: 0.06,
                    }}
                  >
                    <DoubleHeadedEagle size={120} color="var(--color-canvas)" />
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  )
}
