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
    ...(isCoach
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/dashboard/settings", label: "Settings" },
        ]
      : []),
    { href: "/athlete/history", label: "History" },
    { href: "/how-it-works", label: "How It Works" },
  ]

  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        background:
          "linear-gradient(180deg, var(--color-canvas-pale) 0%, var(--color-canvas-raised) 100%)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Top decorative micro-strip */}
      <div
        aria-hidden="true"
        className="h-0.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-ink) 25%, var(--color-accent) 50%, var(--color-ink) 75%, transparent 100%)",
        }}
      />

      <div className="flex items-stretch justify-between px-6 md:px-10">
        {/* Left block: wordmark + links */}
        <div className="flex items-stretch gap-8">
          <Link
            href="/"
            className="flex items-center gap-3 py-4"
            style={{ textDecoration: "none" }}
          >
            <DoubleHeadedEagle size={28} color="var(--color-ink)" />
            <div className="flex flex-col leading-none">
              <span
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 800,
                  fontSize: "22px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--color-ink)",
                  lineHeight: 1,
                }}
              >
                MartialOps
                <span style={{ color: "var(--color-accent)" }}>.</span>
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                  marginTop: "4px",
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
                "linear-gradient(180deg, transparent 0%, var(--color-rule-strong) 50%, transparent 100%)",
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
                      color: "var(--color-ink-faint)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                    }}
                  >
                    ·
                  </span>
                )}
                <Link
                  href={l.href}
                  className="group relative flex items-center px-4 transition-colors"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "var(--color-ink)",
                    opacity: 0.7,
                  }}
                >
                  <span className="transition-opacity group-hover:opacity-100">
                    {l.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 left-4 right-4 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{
                      height: "1px",
                      background:
                        "linear-gradient(90deg, transparent, var(--color-accent) 50%, transparent)",
                    }}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right block: theme toggle + sign out */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <span
            aria-hidden="true"
            className="hidden md:inline"
            style={{
              color: "var(--color-ink-faint)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            ·
          </span>
          <SignOutButton name={session.user.name ?? null} />
        </div>
      </div>

      {/* Bottom decorative rule — thick oxblood bar with center mark */}
      <MarkedRule
        color="var(--color-ink)"
        markColor="var(--color-accent)"
        thickness={4}
        markSize={10}
      />
    </nav>
  )
}
