"use client"

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
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid rgba(132,204,22,0.08)" }}
    >
      <span className="text-sm" style={{ color: "rgba(148,163,184,0.85)" }}>
        {label}
      </span>
      <input
        type="number"
        step="0.1"
        min="0"
        max={max}
        value={value}
        onChange={e => {
          const v = parseFloat(e.target.value)
          if (isFinite(v)) onChange(v)
        }}
        className="rounded-lg px-3 py-1.5 text-sm text-center w-24"
        style={{
          background: "rgba(132,204,22,0.06)",
          border: "1px solid rgba(132,204,22,0.2)",
          color: "#84cc16",
          outline: "none",
        }}
      />
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
    setValues(v => ({ ...v, [key]: value }))
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
    <div className="flex flex-col gap-6 frost-enter-2">
      <div
        className="frost-card rounded-2xl overflow-hidden"
        style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
      >
        <div className="frost-card-header px-5 py-3">
          <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>
            Load Multipliers
          </p>
        </div>
        <div className="px-5 py-2">
          <SettingRow label="Sparring" value={values.multiplierSparring} max={10} onChange={v => set("multiplierSparring", v)} />
          <SettingRow label="Drilling" value={values.multiplierDrilling} max={10} onChange={v => set("multiplierDrilling", v)} />
          <SettingRow label="Conditioning" value={values.multiplierConditioning} max={10} onChange={v => set("multiplierConditioning", v)} />
          <SettingRow label="Weights" value={values.multiplierWeights} max={10} onChange={v => set("multiplierWeights", v)} />
        </div>
      </div>

      <div
        className="frost-card rounded-2xl overflow-hidden"
        style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
      >
        <div className="frost-card-header px-5 py-3">
          <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>
            Readiness Weights
          </p>
        </div>
        <div className="px-5 py-2">
          <SettingRow label="Sleep Weight" value={values.sleepWeight} max={5} onChange={v => set("sleepWeight", v)} />
          <SettingRow label="Soreness Weight" value={values.sorenessWeight} max={5} onChange={v => set("sorenessWeight", v)} />
          <SettingRow label="Stress Weight" value={values.stressWeight} max={5} onChange={v => set("stressWeight", v)} />
          <SettingRow label="Injury Penalty" value={values.injuryPenalty} max={100} onChange={v => set("injuryPenalty", v)} />
        </div>
      </div>

      <div className="flex flex-col items-start gap-3">
        {saved && (
          <p className="text-xs font-semibold" style={{ color: "rgba(132,204,22,0.78)" }}>
            Saved.
          </p>
        )}
        {error && (
          <p className="text-xs font-semibold" style={{ color: "#dc2626" }}>
            Failed to save. Try again.
          </p>
        )}
        <button
          onClick={save}
          disabled={!dirty || saving}
          className="px-6 py-2 rounded-lg text-xs font-bold tracking-widest uppercase"
          style={{
            background: dirty && !saving ? "rgba(132,204,22,0.15)" : "rgba(132,204,22,0.05)",
            border: "1px solid rgba(132,204,22,0.35)",
            color: dirty && !saving ? "#84cc16" : "rgba(132,204,22,0.35)",
            cursor: dirty && !saving ? "pointer" : "default",
          }}
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          onClick={resetToDefaults}
          className="text-xs font-semibold"
          style={{ color: "rgba(132,204,22,0.45)", background: "none", border: "none", cursor: "pointer" }}
        >
          Reset to defaults
        </button>
      </div>
    </div>
  )
}
