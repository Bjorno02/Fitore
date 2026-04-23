import Link from "next/link"
import { DoubleHeadedEagle, MarkedRule } from "./Ornaments"

const INSTAGRAM_HANDLE = "bjornshurdha"
const CONTACT_EMAIL = "bshurd42@gmail.com"

function FooterLink({
  href,
  external,
  children,
}: {
  href: string
  external?: boolean
  children: React.ReactNode
}) {
  const className =
    "group inline-flex items-center gap-2 transition-opacity hover:opacity-100"
  const style: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "var(--color-canvas)",
    opacity: 0.75,
    textDecoration: "none",
  }
  const arrow = (
    <span
      aria-hidden="true"
      className="transition-transform group-hover:translate-x-1"
      style={{ color: "var(--color-gold-light)" }}
    >
      →
    </span>
  )
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        <span>{children}</span>
        {arrow}
      </a>
    )
  }
  return (
    <Link href={href} className={className} style={style}>
      <span>{children}</span>
      {arrow}
    </Link>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      className="relative mt-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--color-ink) 0%, var(--color-ink-deepest) 100%)",
        color: "var(--color-canvas)",
      }}
    >
      {/* Top decorative gradient strip */}
      <div
        aria-hidden="true"
        className="h-0.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent) 25%, var(--color-gold-light) 50%, var(--color-accent) 75%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:px-12 md:py-14">
        {/* Row 1: wordmark + tagline */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-4"
            style={{ textDecoration: "none" }}
          >
            <DoubleHeadedEagle size={36} color="var(--color-canvas)" />
            <span
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "24px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--color-canvas)",
                lineHeight: 1,
              }}
            >
              MartialOps
              <span style={{ color: "var(--color-accent-bright)" }}>.</span>
            </span>
          </Link>

          <p
            className="max-w-md md:text-right"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "14px",
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "var(--color-canvas)",
            }}
          >
            Two numbers. Zero nonsense.{" "}
            <span style={{ color: "var(--color-accent-bright)" }}>
              Train with purpose.
            </span>
          </p>
        </div>

        {/* Row 2: links */}
        <div
          className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-6"
          style={{ borderColor: "rgba(246, 220, 159, 0.15)" }}
        >
          <FooterLink href="/how-it-works">How It Works</FooterLink>
          <span aria-hidden="true" style={{ color: "rgba(246,220,159,0.25)" }}>
            ·
          </span>
          <FooterLink
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            external
          >
            Instagram
          </FooterLink>
          <span aria-hidden="true" style={{ color: "rgba(246,220,159,0.25)" }}>
            ·
          </span>
          <FooterLink href={`mailto:${CONTACT_EMAIL}`} external>
            Email
          </FooterLink>
        </div>

        {/* Marked rule */}
        <div className="my-8">
          <MarkedRule
            color="rgba(246, 220, 159, 0.25)"
            markColor="var(--color-accent-bright)"
          />
        </div>

        {/* Bottom meta row */}
        <div
          className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(246, 220, 159, 0.55)",
          }}
        >
          <span>© {year} MartialOps · All Rights Reserved</span>

          <span className="hidden md:inline">
            No. 01 · The Method · Est. 2026
          </span>

          <span className="hidden lg:inline">
            Eagle ·{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Displayed_double_head_eagle.svg"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "inherit",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Wikimedia
            </a>{" "}
            · CC BY-SA 3.0
          </span>

          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="transition-opacity hover:opacity-100"
              style={{
                color: "rgba(246, 220, 159, 0.55)",
                opacity: 0.8,
                textDecoration: "none",
              }}
            >
              Terms
            </Link>
            <span aria-hidden="true" style={{ color: "rgba(246,220,159,0.25)" }}>
              ·
            </span>
            <Link
              href="/privacy"
              className="transition-opacity hover:opacity-100"
              style={{
                color: "rgba(246, 220, 159, 0.55)",
                opacity: 0.8,
                textDecoration: "none",
              }}
            >
              Privacy
            </Link>
            <span aria-hidden="true" style={{ color: "rgba(246,220,159,0.25)" }}>
              ·
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block"
                style={{
                  width: "5px",
                  height: "5px",
                  backgroundColor: "var(--color-accent-bright)",
                  transform: "rotate(45deg)",
                }}
              />
              Fin
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
