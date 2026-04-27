"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { DoubleHeadedEagle, DotGrid } from "@/components/Ornaments"

type Props = {
  gymName: string
  userName: string | null | undefined
  role: string
}

export default function HomePending({ gymName, userName, role }: Props) {
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <main className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{ top: "18%", right: "5%", opacity: 0.055 }}
        aria-hidden="true"
      >
        <DoubleHeadedEagle size={260} color="var(--color-ink)" />
      </div>

      <DotGrid
        cols={16}
        rows={7}
        size={2}
        gap={11}
        color="var(--color-ink)"
        style={{
          position: "absolute",
          bottom: 120,
          left: 40,
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />

      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center gap-3 border-b py-4"
          style={{
            borderColor: "var(--color-rule-strong)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
            textTransform: "uppercase",
            color: "var(--color-ink-muted)",
          }}
        >
          <span aria-hidden="true" className="relative inline-flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
          </span>
          <span style={{ color: "var(--color-ink)" }}>In Review</span>
          <span style={{ color: "var(--color-ink-faint)" }}>·</span>
          <span>{dateStr}</span>
          {userName && (
            <>
              <span style={{ color: "var(--color-ink-faint)" }}>·</span>
              <span>{userName}</span>
            </>
          )}
          <span
            className="ml-auto hidden md:inline"
            style={{ color: "var(--color-ink-faint)" }}
          >
            Status · Pending Coach Approval
          </span>
        </motion.div>
      </div>

      <section className="mx-auto max-w-5xl px-6 pb-12 pt-20 md:px-12 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 flex items-center gap-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
            textTransform: "uppercase",
            color: "var(--color-ink-muted)",
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "var(--color-accent)",
              transform: "rotate(45deg)",
            }}
          />
          <span>[Holding Pattern] — Awaiting Approval</span>
        </motion.div>

        <h1
          className="gradient-text-ink"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 800,
            fontSize: "var(--text-display-xl)",
            lineHeight: "var(--leading-display)",
            letterSpacing: "var(--tracking-display)",
            textTransform: "uppercase",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "inline-block" }}
            >
              {gymName}
            </motion.div>
            <motion.span
              style={{
                color: "var(--color-accent)",
                WebkitTextFillColor: "var(--color-accent)",
                display: "inline-block",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.55,
                duration: 0.45,
                type: "spring",
                stiffness: 260,
                damping: 12,
              }}
            >
              .
            </motion.span>
          </div>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 max-w-2xl"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "19px",
            lineHeight: 1.7,
            color: "var(--color-ink-soft)",
          }}
        >
          Your request has joined the queue. A coach will review and approve you —{" "}
          <em
            style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              fontStyle: "italic",
            }}
          >
            typically within 24 hours.
          </em>{" "}
          Logging and dashboard access open up the moment they sign off.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-14 flex flex-wrap items-baseline gap-5 border-t pt-5"
          style={{
            borderColor: "var(--color-rule)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
            textTransform: "uppercase",
            color: "var(--color-ink-muted)",
          }}
        >
          <span>
            <span style={{ color: "var(--color-accent)" }}>[§</span> 01{" "}
            <span style={{ color: "var(--color-accent)" }}>]</span> Requested Role ·{" "}
            <span style={{ color: "var(--color-ink)" }}>{role}</span>
          </span>
          <span style={{ color: "var(--color-ink-faint)" }}>·</span>
          <span>
            <span style={{ color: "var(--color-accent)" }}>[§</span> 02{" "}
            <span style={{ color: "var(--color-accent)" }}>]</span> Queue Position ·{" "}
            <span style={{ color: "var(--color-ink)" }}>Awaiting</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="mt-12 flex flex-wrap gap-4"
        >
          <Link
            href="/profile"
            className="group flex items-center justify-between gap-6 border px-6 py-4 transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--color-accent)",
              borderColor: "var(--color-accent-hover)",
              color: "var(--color-accent-ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-label)",
            }}
          >
            <span>View Full Status</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            href="/how-it-works"
            className="group flex items-center justify-between gap-6 border px-6 py-4 transition-all hover:-translate-y-0.5"
            style={{
              borderColor: "var(--color-ink)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-label)",
            }}
          >
            <span>The Method</span>
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
              style={{ color: "var(--color-accent)" }}
            >
              →
            </span>
          </Link>
        </motion.div>
      </section>
    </main>
  )
}
