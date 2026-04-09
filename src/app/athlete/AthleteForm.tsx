"use client"

import { useState } from "react"

const SESSION_DEFAULTS = { duration: "0", intensity: "0", type: "drilling" }
const CHECKIN_DEFAULTS = { sleep: "0", soreness: "0", stress: "0", injury: false }
const SESSION_TYPES = ["drilling", "sparring", "conditioning", "weights"] as const

const NUM_PANEL: React.CSSProperties = {
  background: "linear-gradient(160deg, #18181b 0%, #282830 100%)",
}
const NUM_SHEEN: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.09) 0%, transparent 45%, rgba(0,0,0,0.15) 100%)",
}
const CONTENT_GLOW: React.CSSProperties = {
  background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(132,204,22,0.05) 0%, transparent 70%)",
}
const HEADER_BG: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(132,204,22,0.06) 0%, transparent 100%)",
}

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

function StatusBanner({ successMsg, errorMsg }: { successMsg: string | null; errorMsg: string | null }) {
  if (successMsg) return (
    <p className="rounded-lg px-4 py-2 text-sm font-medium mb-3"
      style={{ background: "rgba(37, 99, 235, 0.08)", color: "#2563eb", border: "1px solid rgba(37, 99, 235, 0.15)" }}>
      {successMsg}
    </p>
  )
  if (errorMsg) return (
    <p className="rounded-lg px-4 py-2 text-sm font-medium mb-3"
      style={{ background: "rgba(220, 38, 38, 0.06)", color: "#dc2626", border: "1px solid rgba(220, 38, 38, 0.12)" }}>
      {errorMsg}
    </p>
  )
  return null
}

function CardHeader({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-stretch" style={{ borderBottom: "1px solid rgba(132,204,22,0.18)" }}>
      {/* Number panel */}
      <div
        className="relative flex items-center justify-center flex-shrink-0 overflow-hidden"
        style={{ width: 72, minHeight: 56, ...NUM_PANEL }}
      >
        <div className="absolute inset-0" style={NUM_SHEEN} />
        <div
          className="absolute right-0 inset-y-3"
          style={{ width: 1, background: "linear-gradient(180deg, transparent, rgba(132,204,22,0.28), transparent)" }}
        />
        <span
          className="relative select-none"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 900,
            fontSize: "2.4rem",
            color: "rgba(255,255,255,0.14)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >{num}</span>
      </div>
      {/* Label */}
      <div className="flex-1 px-5 py-3.5 flex items-center" style={HEADER_BG}>
        <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>{label}</p>
      </div>
    </div>
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
        body: JSON.stringify({ sleep, soreness, stress, injury: checkinForm.injury, gymId }),
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
    <div className="flex flex-row gap-5 h-full">

      <section
        className="frost-card rounded-2xl overflow-hidden frost-enter flex-1 flex flex-col"
        style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
      >
        <CardHeader num="01" label="Log Training Session" />
        <div className="relative px-6 py-5 flex-1 flex flex-col">
          <div className="absolute inset-0 pointer-events-none" style={CONTENT_GLOW} />
          <div className="relative flex-1 flex flex-col">
            <StatusBanner successMsg={sessionStatus.successMsg} errorMsg={sessionStatus.errorMsg} />
            <form onSubmit={handleSessionSubmit} noValidate className="flex flex-col gap-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="frost-label">Duration (min)</label>
                  <input type="number" className="frost-input" value={sessionForm.duration}
                    onChange={e => setSessionForm(prev => ({ ...prev, duration: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="frost-label">Intensity (1–10)</label>
                  <input type="number" className="frost-input" value={sessionForm.intensity}
                    onChange={e => setSessionForm(prev => ({ ...prev, intensity: e.target.value }))} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="frost-label">Type</label>
                <select className="frost-input" value={sessionForm.type}
                  onChange={e => setSessionForm(prev => ({ ...prev, type: e.target.value }))}>
                  {SESSION_TYPES.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={sessionLoading} className="btn-frost-primary mt-auto">
                {sessionLoading ? "Logging…" : "Log Session"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section
        className="frost-card rounded-2xl overflow-hidden frost-enter-2 flex-1 flex flex-col"
        style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
      >
        <CardHeader num="02" label="Daily Check-in" />
        <div className="relative px-6 py-5 flex-1 flex flex-col">
          <div className="absolute inset-0 pointer-events-none" style={CONTENT_GLOW} />
          <div className="relative flex-1 flex flex-col">
            <StatusBanner successMsg={checkinStatus.successMsg} errorMsg={checkinStatus.errorMsg} />
            <form onSubmit={handleCheckinSubmit} noValidate className="flex flex-col gap-4 flex-1">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="frost-label">Sleep (1–10)</label>
                  <input type="number" className="frost-input" value={checkinForm.sleep}
                    onChange={e => setCheckinForm(prev => ({ ...prev, sleep: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="frost-label">Soreness (1–10)</label>
                  <input type="number" className="frost-input" value={checkinForm.soreness}
                    onChange={e => setCheckinForm(prev => ({ ...prev, soreness: e.target.value }))} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="frost-label">Stress (1–10)</label>
                  <input type="number" className="frost-input" value={checkinForm.stress}
                    onChange={e => setCheckinForm(prev => ({ ...prev, stress: e.target.value }))} />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={checkinForm.injury}
                  onChange={e => setCheckinForm(prev => ({ ...prev, injury: e.target.checked }))}
                  className="w-4 h-4 rounded accent-blue-500" />
                <span className="frost-label group-hover:text-text-secondary transition-colors">Reporting injury</span>
              </label>
              <button type="submit" disabled={checkinLoading} className="btn-frost-primary mt-auto">
                {checkinLoading ? "Submitting…" : "Submit Check-in"}
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}
