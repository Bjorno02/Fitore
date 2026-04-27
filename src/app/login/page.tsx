"use client"

import { signIn } from "next-auth/react"
import { motion } from "motion/react"
import { useState } from "react"
import { DoubleHeadedEagle, DotGrid } from "@/components/Ornaments"
import ThemeToggle from "@/components/ThemeToggle"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setLoading(true)
    await signIn("google", { callbackUrl: "/" })
  }

  return (
    <main className="relative h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{
          top: "20%",
          right: "4%",
          opacity: 0.055,
        }}
        aria-hidden="true"
      >
        <DoubleHeadedEagle size={280} color="var(--color-ink)" />
      </div>

{/* Faint dot texture */}
      <DotGrid
        cols={16}
        rows={7}
        size={2}
        gap={11}
        color="var(--color-ink)"
        style={{
          position: "absolute",
          bottom: 80,
          left: 40,
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />

      <div className="fixed inset-x-0 top-16 z-50 flex justify-center md:top-24">
        <ThemeToggle />
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <section className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 pb-16 pt-40 text-center md:px-12 md:pb-20 md:pt-52">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 flex items-center justify-center gap-3"
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
          <span>§ 00 · Sign In</span>
        </motion.div>

        {/* Stacked theatrical headline */}
        <h1
          className="gradient-text-ink max-w-full"
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
              Ready When
            </motion.div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "inline-block" }}
            >
              You Are
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

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="mt-12 max-w-xl"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "18px",
            lineHeight: 1.7,
            color: "var(--color-ink-soft)",
          }}
        >
          Your gym is waiting. Sign in with Google to pick up where you left off.
        </motion.p>

        {/* Sign-in module */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-14 flex w-full max-w-md flex-col gap-4"
        >
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="group flex items-center justify-between border px-6 py-5 transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            style={{
              backgroundColor: "var(--color-canvas-raised)",
              borderColor: "var(--color-ink)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-label)",
            }}
          >
            <span className="flex items-center gap-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
              <span>{loading ? "Redirecting…" : "Continue with Google"}</span>
            </span>
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
              style={{ color: "var(--color-accent)" }}
            >
              →
            </span>
          </button>

          <p
            className="pt-2"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.12em",
              color: "var(--color-ink-faint)",
              lineHeight: 1.8,
            }}
          >
            By signing in you agree to your gym&apos;s terms and conditions.
          </p>
        </motion.div>
      </section>
    </main>
  )
}
