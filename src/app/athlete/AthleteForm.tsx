"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

const SESSION_DEFAULTS = { duration: "0", intensity: "0", type: "drilling" }
const CHECKIN_DEFAULTS = { sleep: "0", soreness: "0", stress: "0", injury: false }
const SESSION_TYPES = ["drilling", "sparring", "conditioning", "weights"] as const

function useFormStatus() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function setSuccess(msg: string) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  function setError(msg: string) {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(null), 3000)
  }

  return { successMsg, errorMsg, setSuccess, setError }
}

function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-eyebrow)",
        letterSpacing: "var(--tracking-eyebrow)",
        textTransform: "uppercase",
        color: "var(--color-ink-muted)",
      }}
    >
      {children}
    </span>
  )
}

function EditorialInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="border-b bg-transparent py-2 text-lg outline-none transition-colors focus:border-[var(--color-accent)]"
      style={{
        borderColor: "var(--color-rule-strong)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-sans)",
        ...(props.style ?? {}),
      }}
    />
  )
}

function EditorialSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: readonly string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none border-b bg-transparent py-2 pr-8 text-lg outline-none transition-colors focus:border-[var(--color-accent)]"
      style={{
        borderColor: "var(--color-rule-strong)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-sans)",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23059669' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {options.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>
  )
}

function StatusBanner({
  successMsg,
  errorMsg,
}: {
  successMsg: string | null
  errorMsg: string | null
}) {
  return (
    <AnimatePresence>
      {(successMsg || errorMsg) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mb-4 border-l-2 pl-4 py-2"
          style={{
            borderColor: errorMsg ? "#b91c1c" : "var(--color-accent)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: errorMsg ? "#b91c1c" : "var(--color-ink)",
          }}
        >
          {errorMsg ? `✗ ${errorMsg}` : `✓ ${successMsg}`}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SectionHead({ num, label, meta }: { num: string; label: string; meta?: string }) {
  return (
    <div
      className="mb-6 flex items-baseline justify-between border-b pb-4"
      style={{ borderColor: "var(--color-rule-strong)" }}
    >
      <div>
        <MonoLabel>
          <span style={{ color: "var(--color-accent)" }}>§ {num}</span> {label}
        </MonoLabel>
      </div>
      {meta && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--tracking-label)",
            textTransform: "uppercase",
            color: "var(--color-ink-faint)",
          }}
        >
          {meta}
        </span>
      )}
    </div>
  )
}

function PrimaryCTA({
  children,
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      disabled={disabled}
      className="group mt-auto flex items-center justify-between border px-6 py-4 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
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
      <span>{children}</span>
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        →
      </span>
    </button>
  )
}

export default function AthleteForm({ gymId }: { gymId: string }) {
  const [sessionForm, setSessionForm] = useState(SESSION_DEFAULTS)
  const [checkinForm, setCheckinForm] = useState(CHECKIN_DEFAULTS)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [checkinLoading, setCheckinLoading] = useState(false)
  const sessionStatus = useFormStatus()
  const checkinStatus = useFormStatus()

  async function handleSessionSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    const duration = Number(sessionForm.duration)
    const intensity = Number(sessionForm.intensity)
    if (!sessionForm.duration || isNaN(duration) || duration < 1) {
      sessionStatus.setError("Duration must be at least 1 minute")
      return
    }
    if (isNaN(intensity) || intensity < 1 || intensity > 10) {
      sessionStatus.setError("Intensity must be between 1 and 10")
      return
    }
    setSessionLoading(true)
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration, intensity, type: sessionForm.type, gymId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        sessionStatus.setError(data.error ?? "Something went wrong")
      } else {
        setSessionForm(SESSION_DEFAULTS)
        sessionStatus.setSuccess("Session logged.")
      }
    } catch {
      sessionStatus.setError("Network error — try again")
    } finally {
      setSessionLoading(false)
    }
  }

  async function handleCheckinSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    const sleep = Number(checkinForm.sleep)
    const soreness = Number(checkinForm.soreness)
    const stress = Number(checkinForm.stress)
    if (isNaN(sleep) || sleep < 1 || sleep > 10) {
      checkinStatus.setError("Sleep must be between 1 and 10")
      return
    }
    if (isNaN(soreness) || soreness < 1 || soreness > 10) {
      checkinStatus.setError("Soreness must be between 1 and 10")
      return
    }
    if (isNaN(stress) || stress < 1 || stress > 10) {
      checkinStatus.setError("Stress must be between 1 and 10")
      return
    }
    setCheckinLoading(true)
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sleep,
          soreness,
          stress,
          injury: checkinForm.injury,
          gymId,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        checkinStatus.setError(data.error ?? "Something went wrong")
      } else {
        setCheckinForm(CHECKIN_DEFAULTS)
        checkinStatus.setSuccess("Check-in submitted.")
      }
    } catch {
      checkinStatus.setError("Network error — try again")
    } finally {
      setCheckinLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
      {/* § 01 Session */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="flex flex-col"
      >
        <SectionHead num="01" label="Log Session" meta="Training" />
        <StatusBanner
          successMsg={sessionStatus.successMsg}
          errorMsg={sessionStatus.errorMsg}
        />
        <form
          onSubmit={handleSessionSubmit}
          noValidate
          className="flex flex-1 flex-col gap-6"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <MonoLabel>Duration (min)</MonoLabel>
              <EditorialInput
                type="number"
                value={sessionForm.duration}
                onChange={(e) =>
                  setSessionForm((prev) => ({ ...prev, duration: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <MonoLabel>Intensity (1–10)</MonoLabel>
              <EditorialInput
                type="number"
                value={sessionForm.intensity}
                onChange={(e) =>
                  setSessionForm((prev) => ({ ...prev, intensity: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <MonoLabel>Type</MonoLabel>
            <EditorialSelect
              value={sessionForm.type}
              onChange={(v) => setSessionForm((prev) => ({ ...prev, type: v }))}
              options={SESSION_TYPES}
            />
          </div>
          <PrimaryCTA type="submit" disabled={sessionLoading}>
            {sessionLoading ? "Logging…" : "Log Session"}
          </PrimaryCTA>
        </form>
      </motion.section>

      {/* § 02 Check-in */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex flex-col"
      >
        <SectionHead num="02" label="Daily Check-in" meta="State" />
        <StatusBanner
          successMsg={checkinStatus.successMsg}
          errorMsg={checkinStatus.errorMsg}
        />
        <form
          onSubmit={handleCheckinSubmit}
          noValidate
          className="flex flex-1 flex-col gap-6"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <MonoLabel>Sleep</MonoLabel>
              <EditorialInput
                type="number"
                value={checkinForm.sleep}
                onChange={(e) =>
                  setCheckinForm((prev) => ({ ...prev, sleep: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <MonoLabel>Soreness</MonoLabel>
              <EditorialInput
                type="number"
                value={checkinForm.soreness}
                onChange={(e) =>
                  setCheckinForm((prev) => ({ ...prev, soreness: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <MonoLabel>Stress</MonoLabel>
              <EditorialInput
                type="number"
                value={checkinForm.stress}
                onChange={(e) =>
                  setCheckinForm((prev) => ({ ...prev, stress: e.target.value }))
                }
              />
            </div>
          </div>
          <label
            className="group flex cursor-pointer items-center gap-3 border border-transparent px-1 py-2 transition-colors hover:border-[var(--color-rule)]"
          >
            <span
              className="relative inline-flex h-4 w-4 items-center justify-center border"
              style={{
                borderColor: checkinForm.injury
                  ? "var(--color-accent)"
                  : "var(--color-ink)",
                backgroundColor: checkinForm.injury
                  ? "var(--color-accent)"
                  : "transparent",
              }}
            >
              {checkinForm.injury && (
                <span
                  style={{
                    color: "var(--color-accent-ink)",
                    fontSize: "11px",
                    lineHeight: 1,
                  }}
                >
                  ✓
                </span>
              )}
            </span>
            <input
              type="checkbox"
              checked={checkinForm.injury}
              onChange={(e) =>
                setCheckinForm((prev) => ({ ...prev, injury: e.target.checked }))
              }
              className="sr-only"
            />
            <MonoLabel>Reporting Injury</MonoLabel>
          </label>
          <PrimaryCTA type="submit" disabled={checkinLoading}>
            {checkinLoading ? "Submitting…" : "Submit Check-in"}
          </PrimaryCTA>
        </form>
      </motion.section>
    </div>
  )
}
