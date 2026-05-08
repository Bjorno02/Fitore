"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DoubleHeadedEagle, DotGrid } from "@/components/Ornaments"

const REDEEM_ERRORS: Record<string, string> = {
  invalid_code: "We don't recognize that code.",
  expired: "That code has expired.",
  exhausted: "That code is fully used.",
  revoked: "That code was revoked.",
  already_member: "You're already in this gym.",
}

export default function OnboardingPage() {
  const router = useRouter()

  const [gymName, setGymName] = useState("")
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [code, setCode] = useState("")
  const [redeeming, setRedeeming] = useState(false)
  const [redeemError, setRedeemError] = useState<string | null>(null)

  async function handleCreate(e: React.SyntheticEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)
    const res = await fetch("/api/gyms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: gymName }),
    })
    if (res.ok) {
      router.push("/")
    } else {
      const data = await res.json().catch(() => ({}))
      setCreateError(data.error ?? "Something went wrong")
      setCreating(false)
    }
  }

  async function handleRedeem(e: React.SyntheticEvent) {
    e.preventDefault()
    setRedeeming(true)
    setRedeemError(null)
    const res = await fetch("/api/invite-codes/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
    })
    if (res.ok) {
      router.push("/")
    } else {
      const data = await res.json().catch(() => ({}))
      const key = typeof data?.error === "string" ? data.error : ""
      setRedeemError(REDEEM_ERRORS[key] ?? "Couldn't redeem that code.")
      setRedeeming(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          top: "10%",
          right: "4%",
          opacity: 0.055,
        }}
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

      <div className="mx-auto max-w-6xl px-5 md:px-12">
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b py-4"
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
            Fitore<span style={{ color: "var(--color-accent)" }}>.</span>
          </span>
          <span className="hidden md:inline">Gym Setup · One-Time</span>
          <span>Step 01 · Onboarding</span>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20 md:px-12 md:pt-28">
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
          <span>Welcome · Pick A Lane</span>
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
            >
              Start A Gym
            </motion.div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "inline-block" }}
            >
              Or Join One
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
                delay: 0.8,
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
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="flex flex-col"
          >
            <div
              className="mb-6 flex items-baseline justify-between border-b pb-4"
              style={{ borderColor: "var(--color-rule-strong)" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-eyebrow)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                }}
              >
                <span style={{ color: "var(--color-accent)" }}>§ 01</span> Create
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-eyebrow)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-faint)",
                }}
              >
                Coach / Owner
              </span>
            </div>

            <h2
              className="mb-8"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "var(--text-display-md)",
                lineHeight: "var(--leading-display)",
                letterSpacing: "var(--tracking-display)",
                textTransform: "uppercase",
                color: "var(--color-ink)",
              }}
            >
              Start A New Gym
            </h2>

            <p
              className="mb-8"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                lineHeight: 1.7,
                color: "var(--color-ink-soft)",
              }}
            >
              You&apos;ll be the first coach. Generate invite codes from the dashboard to add athletes.
            </p>

            <form onSubmit={handleCreate} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="gym-name"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-eyebrow)",
                    letterSpacing: "var(--tracking-eyebrow)",
                    textTransform: "uppercase",
                    color: "var(--color-ink-muted)",
                  }}
                >
                  Gym Name
                </label>
                <input
                  id="gym-name"
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="e.g. Downtown BJJ"
                  className="border-b bg-transparent py-3.5 outline-none transition-colors focus:border-[var(--color-accent)]"
                  style={{
                    borderColor: "var(--color-rule-strong)",
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "18px",
                  }}
                />
              </div>

              {createError && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    color: "#b91c1c",
                    textTransform: "uppercase",
                  }}
                >
                  ✗ {createError}
                </p>
              )}

              <button
                type="submit"
                disabled={creating || !gymName.trim()}
                className="group mt-2 flex items-center justify-between border px-6 py-4 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
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
                <span>{creating ? "Creating…" : "Create Gym"}</span>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.6 }}
            className="flex flex-col"
          >
            <div
              className="mb-6 flex items-baseline justify-between border-b pb-4"
              style={{ borderColor: "var(--color-rule-strong)" }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-eyebrow)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                }}
              >
                <span style={{ color: "var(--color-accent)" }}>§ 02</span> Redeem
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-eyebrow)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-faint)",
                }}
              >
                Athlete
              </span>
            </div>

            <h2
              className="mb-8"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "var(--text-display-md)",
                lineHeight: "var(--leading-display)",
                letterSpacing: "var(--tracking-display)",
                textTransform: "uppercase",
                color: "var(--color-ink)",
              }}
            >
              Enter Invite Code
            </h2>

            <p
              className="mb-8"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "16px",
                lineHeight: 1.7,
                color: "var(--color-ink-soft)",
              }}
            >
              Your coach will give you a code. Type it in and you&apos;re in — no waiting.
            </p>

            <form onSubmit={handleRedeem} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="invite-code"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-eyebrow)",
                    letterSpacing: "var(--tracking-eyebrow)",
                    textTransform: "uppercase",
                    color: "var(--color-ink-muted)",
                  }}
                >
                  Invite Code
                </label>
                <input
                  id="invite-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="xxxx-xxxx"
                  autoComplete="off"
                  spellCheck={false}
                  autoCapitalize="off"
                  className="border-b bg-transparent py-3.5 outline-none transition-colors focus:border-[var(--color-accent)]"
                  style={{
                    borderColor: "var(--color-rule-strong)",
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "20px",
                    letterSpacing: "0.08em",
                  }}
                />
              </div>

              {redeemError && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    letterSpacing: "0.12em",
                    color: "#b91c1c",
                    textTransform: "uppercase",
                  }}
                >
                  ✗ {redeemError}
                </p>
              )}

              <button
                type="submit"
                disabled={redeeming || !code.trim()}
                className="group mt-2 flex items-center justify-between border px-6 py-4 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "var(--color-ink)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-label)",
                }}
              >
                <span>{redeeming ? "Redeeming…" : "Join"}</span>
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                  style={{ color: "var(--color-accent)" }}
                >
                  →
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
