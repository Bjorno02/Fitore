"use client"

import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { DEFAULT_LOAD_CONFIG, DEFAULT_READINESS_CONFIG } from "@/lib/scoring"

type Settings = {
  multiplierSparring: number
  multiplierDrilling: number
  multiplierConditioning: number
  multiplierWeights: number
  sleepWeight: number
  sorenessWeight: number
  stressWeight: number
  injuryPenalty: number
}

const DEFAULTS: Settings = {
  multiplierSparring: DEFAULT_LOAD_CONFIG.typeMultipliers.sparring,
  multiplierDrilling: DEFAULT_LOAD_CONFIG.typeMultipliers.drilling,
  multiplierConditioning: DEFAULT_LOAD_CONFIG.typeMultipliers.conditioning,
  multiplierWeights: DEFAULT_LOAD_CONFIG.typeMultipliers.weights,
  sleepWeight: DEFAULT_READINESS_CONFIG.sleepWeight,
  sorenessWeight: DEFAULT_READINESS_CONFIG.sorenessWeight,
  stressWeight: DEFAULT_READINESS_CONFIG.stressWeight,
  injuryPenalty: DEFAULT_READINESS_CONFIG.injuryPenalty,
}

function SettingRow({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: number
  max: number
  onChange: (v: number) => void
}) {
  return (
    <div
      className="flex items-baseline justify-between border-b py-4"
      style={{ borderColor: "var(--color-rule)" }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
        }}
      >
        {label}
      </span>
      <input
        type="number"
        step="0.1"
        min="0"
        max={max}
        value={value}
        onChange={(e) => {
          const v = parseFloat(e.target.value)
          if (isFinite(v)) onChange(v)
        }}
        className="w-24 border-b bg-transparent py-1 text-right text-lg outline-none transition-colors focus:border-[var(--color-accent)]"
        style={{
          borderColor: "var(--color-rule-strong)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-barlow)",
          fontWeight: 700,
        }}
      />
    </div>
  )
}

function SectionHead({ num, label }: { num: string; label: string }) {
  return (
    <div
      className="mb-4 border-b pb-3"
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
        <span style={{ color: "var(--color-accent)" }}>§ {num}</span> {label}
      </div>
    </div>
  )
}

export default function SettingsForm({
  gymId,
  initial,
}: {
  gymId: string
  initial: Settings
}) {
  const [values, setValues] = useState<Settings>(initial)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [error, setError] = useState(false)
  const [saving, setSaving] = useState(false)

  function set(key: keyof Settings, value: number) {
    setValues((v) => ({ ...v, [key]: value }))
    setSaved(false)
    setError(false)
    setDirty(true)
  }

  function resetToDefaults() {
    setValues(DEFAULTS)
    setSaved(false)
    setDirty(true)
  }

  async function save() {
    setSaving(true)
    const res = await fetch(`/api/gyms/${gymId}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    if (res.ok) {
      setSaved(true)
      setDirty(false)
      setError(false)
    } else {
      setError(true)
    }
    setSaving(false)
  }

  return (
    <div className="flex flex-col gap-14">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        <SectionHead num="01" label="Load Multipliers" />
        <p
          className="mb-6"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "var(--color-ink-soft)",
          }}
        >
          How hard is each session type? A sparring round is not a drilling round.
        </p>
        <div>
          <SettingRow
            label="Sparring"
            value={values.multiplierSparring}
            max={10}
            onChange={(v) => set("multiplierSparring", v)}
          />
          <SettingRow
            label="Drilling"
            value={values.multiplierDrilling}
            max={10}
            onChange={(v) => set("multiplierDrilling", v)}
          />
          <SettingRow
            label="Conditioning"
            value={values.multiplierConditioning}
            max={10}
            onChange={(v) => set("multiplierConditioning", v)}
          />
          <SettingRow
            label="Weights"
            value={values.multiplierWeights}
            max={10}
            onChange={(v) => set("multiplierWeights", v)}
          />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <SectionHead num="02" label="Readiness Weights" />
        <p
          className="mb-6"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            lineHeight: 1.7,
            color: "var(--color-ink-soft)",
          }}
        >
          How much does each input move the readiness score?
        </p>
        <div>
          <SettingRow
            label="Sleep Weight"
            value={values.sleepWeight}
            max={5}
            onChange={(v) => set("sleepWeight", v)}
          />
          <SettingRow
            label="Soreness Weight"
            value={values.sorenessWeight}
            max={5}
            onChange={(v) => set("sorenessWeight", v)}
          />
          <SettingRow
            label="Stress Weight"
            value={values.stressWeight}
            max={5}
            onChange={(v) => set("stressWeight", v)}
          />
          <SettingRow
            label="Injury Penalty"
            value={values.injuryPenalty}
            max={100}
            onChange={(v) => set("injuryPenalty", v)}
          />
        </div>
      </motion.section>

      <section>
        <AnimatePresence>
          {(saved || error) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mb-4 border-l-2 pl-4 py-2"
              style={{
                borderColor: error ? "#b91c1c" : "var(--color-accent)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: error ? "#b91c1c" : "var(--color-ink)",
              }}
            >
              {error ? "✗ Failed to save. Try again." : "✓ Saved."}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="group flex items-center gap-3 border px-6 py-3 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
            style={{
              backgroundColor: dirty && !saving ? "var(--color-accent)" : "transparent",
              borderColor: dirty && !saving ? "var(--color-accent-hover)" : "var(--color-ink)",
              color: dirty && !saving ? "var(--color-accent-ink)" : "var(--color-ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-label)",
            }}
          >
            <span>{saving ? "Saving…" : dirty ? "Save Changes" : "No Changes"}</span>
            {dirty && !saving && (
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            )}
          </button>

          <button
            onClick={resetToDefaults}
            className="transition-opacity hover:opacity-100"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
              opacity: 0.7,
              textDecoration: "underline",
              textUnderlineOffset: "6px",
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </section>
    </div>
  )
}
