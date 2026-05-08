import Link from "next/link"
import { auth } from "@/auth"
import SignOutButton from "./SignOutButton"
import ThemeToggle from "./ThemeToggle"
import GymSwitcher from "./GymSwitcher"
import MobileNav from "./MobileNav"
import { DoubleHeadedEagle, MarkedRule } from "./Ornaments"
import { getActiveGymContext } from "@/lib/active-gym"

type NavLink = { href: string; label: string; num: string }

export default async function Navbar() {
  const session = await auth()
  if (!session?.user?.id) return null

  const ctx = await getActiveGymContext(session.user.id)

  const isCoach = ctx?.active.role === "COACH" || ctx?.active.role === "ADMIN"

  const links: NavLink[] = [
    { href: "/athlete", num: "01", label: "Log Training" },
    ...(isCoach ? [{ href: "/dashboard", num: "02", label: "Dashboard" }] : []),
    { href: "/athlete/history", num: isCoach ? "03" : "02", label: "History" },
    ...(isCoach ? [{ href: "/dashboard/settings", num: "04", label: "Coach Settings" }] : []),
    { href: "/how-it-works", num: isCoach ? "05" : "03", label: "How It Works" },
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
        <div className="flex items-stretch gap-3 md:gap-8">
          <div className="flex items-center lg:hidden">
            <MobileNav
              links={links}
              active={ctx?.active ?? null}
              all={ctx?.all ?? []}
            />
          </div>
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
            className="my-4 hidden lg:block"
            style={{
              width: "1px",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(246, 220, 159, 0.28) 50%, transparent 100%)",
            }}
          />

          {ctx && (
            <div className="my-4 hidden items-center lg:flex">
              <GymSwitcher active={ctx.active} all={ctx.all} />
            </div>
          )}

          <div
            aria-hidden="true"
            className="my-4 hidden lg:block"
            style={{
              width: "1px",
              background:
                "linear-gradient(180deg, transparent 0%, rgba(246, 220, 159, 0.28) 50%, transparent 100%)",
            }}
          />

          <div className="hidden items-stretch lg:flex">
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
                  className="group relative flex items-center px-3 text-[10px] tracking-[0.14em] transition-opacity hover:opacity-100 xl:px-4 xl:text-[11px] xl:tracking-[0.2em]"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: "var(--color-canvas)",
                    opacity: 0.75,
                  }}
                >
                  <span>{l.label}</span>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-2 left-3 right-3 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 xl:left-4 xl:right-4"
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
          <div className="hidden lg:inline-flex">
            <ThemeToggle />
          </div>
          <span
            aria-hidden="true"
            className="hidden lg:inline"
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
            className="hidden lg:inline"
            style={{
              color: "rgba(246, 220, 159, 0.25)",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
            }}
          >
            ·
          </span>
          <div className="hidden lg:inline-flex">
            <SignOutButton />
          </div>
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
