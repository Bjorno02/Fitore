"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { DoubleHeadedEagle, Sword } from "@/components/Ornaments"

function ActionCard({
  href,
  num,
  label,
  title,
  desc,
  delay,
  icon,
}: {
  href: string
  num: string
  label: string
  title: string
  desc: string
  delay: number
  icon: "eagle" | "sword"
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
    >
      <Link
        href={href}
        className="card-raised card-raised-hover group relative block overflow-hidden p-8 no-underline"
        style={{ minHeight: "260px" }}
      >
        {/* Corner sword decoration */}
        <div
          className="pointer-events-none absolute"
          style={{
            top: "16px",
            right: "16px",
            opacity: 0.12,
            transition: "opacity 0.3s ease, transform 0.4s ease",
          }}
          aria-hidden="true"
        >
          {icon === "eagle" ? (
            <DoubleHeadedEagle size={80} color="var(--color-ink)" />
          ) : (
            <Sword size={36} color="var(--color-ink)" strokeWidth={1} />
          )}
        </div>

        <div className="relative flex h-full flex-col">
          {/* Top: bracket reference */}
          <div
            className="mb-6 flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-rule)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
              }}
            >
              <span style={{ color: "var(--color-accent)" }}>[§</span> {num}{" "}
              <span style={{ color: "var(--color-accent)" }}>]</span> {label}
            </span>
          </div>

          {/* Title with gradient text */}
          <h2
            className="mb-4 gradient-text-ink"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 800,
              fontSize: "var(--text-display-md)",
              lineHeight: "var(--leading-display)",
              letterSpacing: "var(--tracking-display)",
              textTransform: "uppercase",
            }}
          >
            {title}
          </h2>

          {/* Description */}
          <p
            className="mb-6"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "15px",
              lineHeight: 1.6,
              color: "var(--color-ink-soft)",
            }}
          >
            {desc}
          </p>

          {/* Footer: Enter + arrow — gradient button style */}
          <div
            className="mt-auto flex items-center justify-between border-t pt-4"
            style={{ borderColor: "var(--color-rule-strong)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
              }}
            >
              Enter
            </span>
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
              style={{
                color: "var(--color-accent)",
                fontSize: "20px",
              }}
            >
              →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

type Props = { isCoach: boolean }

export default function HomeCards({ isCoach }: Props) {
  return (
    <section className="relative">
      <div
        className={`grid grid-cols-1 gap-6 ${isCoach ? "md:grid-cols-2" : ""}`}
      >
        <ActionCard
          href="/athlete"
          num="01"
          label="Athlete"
          title="Log Training"
          desc="Record today's session and daily check-in. Stay honest with yourself."
          delay={0.1}
          icon="sword"
        />
        {isCoach && (
          <ActionCard
            href="/dashboard"
            num="02"
            label="Coach"
            title="Dashboard"
            desc="See athlete load and readiness across the gym. Approve new members."
            delay={0.2}
            icon="eagle"
          />
        )}
      </div>
    </section>
  )
}
