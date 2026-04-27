import Link from "next/link"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import SignOutButton from "./SignOutButton"
import ThemeToggle from "./ThemeToggle"
import { DoubleHeadedEagle, MarkedRule } from "./Ornaments"

type NavLink = { href: string; label: string }

export default async function Navbar() {
  const session = await auth()
  if (!session?.user?.id) return null

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
  })

  const isCoach = membership?.role === "COACH" || membership?.role === "ADMIN"

  const links: NavLink[] = [
    { href: "/athlete", label: "Log Training" },
    ...(isCoach ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    { href: "/athlete/history", label: "History" },
    ...(isCoach ? [{ href: "/dashboard/settings", label: "Coach Settings" }] : []),
    { href: "/how-it-works", label: "How It Works" },
  ]

  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        background:
          "linear-gradient(180deg, var(--color-ink) 0%, var(--color-ink-deepest) 100%)",
        color: "var(--color-canvas)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Top accent/canvas shimmer strip */}
      <div
        aria-hidden="true"
        className="h-0.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent-bright) 22%, var(--color-canvas) 50%, var(--color-accent-bright) 78%, transparent 100%)",
        }}
      />

      <div className="flex items-stretch justify-between px-6 md:px-10">
        {/* Left block: wordmark + eagle + links */}
        <div className="flex items-stretch gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 py-4"
            style={{ textDecoration: "none" }}
          >
            <DoubleHeadedEagle size={28} color="var(--color-canvas)" />
            <div className="flex flex-col leading-none">
              <span
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 800,
                  fontSize: "22px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--color-canvas)",
                  lineHeight: 1,
                }}
              >
                Fitore
                <span style={{ color: "var(--color-accent-bright)" }}>.</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--color-accent-bright)",
                  marginTop: "4px",
                  opacity: 0.9,
                }}
              >
                No. 01 · The Method
              </span>
            </div>
          </Link>

          <div
            aria-hidden="true"
            className="my-4 hidden md:block"
            style={{
              width: "1px",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(246, 220, 159, 0.28) 50%, transparent 100%)",
            }}
          />

          <div className="hidden items-stretch md:flex">
            {links.map((l, i) => (
              <div key={l.href} className="flex items-stretch">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="flex items-center"
                    style={{
                      color: "rgba(246, 220, 159, 0.25)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                    }}
                  >
                    ·
                  </span>
                )}
                <Link
                  href={l.href}
                  className="group relative flex items-center px-4 transition-opacity hover:opacity-100"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "var(--color-canvas)",
                    opacity: 0.75,
                  }}
                >
                  <span>{l.label}</span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 left-4 right-4 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{
                      height: "2px",
                      background:
                        "linear-gradient(90deg, transparent, var(--color-accent-bright) 50%, transparent)",
                      boxShadow: "0 0 8px var(--color-accent-bright)",
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span
            aria-hidden="true"
            className="hidden md:inline"
            style={{
              color: "rgba(246, 220, 159, 0.25)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            ·
          </span>
          <Link
            href="/profile"
            aria-label="Profile"
            className="group flex flex-col items-center gap-1 py-3 transition-transform hover:-translate-y-0.5"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{
                display: "block",
                filter: "drop-shadow(0 0 6px rgba(221, 112, 48, 0.35))",
              }}
            >
              <circle
                cx="12"
                cy="12"
                r="10.75"
                fill="none"
                stroke="var(--color-accent-bright)"
                strokeWidth="1.25"
              />
              <circle cx="12" cy="10" r="3.4" fill="var(--color-accent-bright)" />
              <path
                d="M5.5 19.5 C 6.2 15.6 9.2 14 12 14 C 14.8 14 17.8 15.6 18.5 19.5 Z"
                fill="var(--color-accent-bright)"
              />
            </svg>
            {session.user.name && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "var(--color-canvas)",
                  opacity: 0.85,
                  lineHeight: 1,
                }}
              >
                {session.user.name.split(" ")[0]}
              </span>
            )}
          </Link>
          <span
            aria-hidden="true"
            className="hidden md:inline"
            style={{
              color: "rgba(246, 220, 159, 0.25)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            ·
          </span>
          <SignOutButton />
        </div>
      </div>

      {/* Bottom thick accent rule */}
      <MarkedRule
        color="var(--color-accent)"
        markColor="var(--color-canvas)"
        thickness={4}
        markSize={10}
      />
    </nav>
  )
}
