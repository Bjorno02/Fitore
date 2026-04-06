"use client"

import { useState } from "react"

const inputClass = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
const labelClass = "text-sm font-medium text-zinc-700"

const SESSION_DEFAULTS = { duration: 0, intensity: 5, type: "drilling" }
const CHECKIN_DEFAULTS = { sleep: 5, soreness: 5, stress: 5, injury: false }

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

  return { successMsg, errorMsg, setSuccess, setError}
}

function StatusBanner({ successMsg, errorMsg }: { successMsg: string | null; errorMsg: string | null }) {
  if (successMsg) return <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{successMsg}</p>
  if (errorMsg) return <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{errorMsg}</p>
  return null
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
    setSessionLoading(true)
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...sessionForm, gymId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        sessionStatus.setError(data.error ?? "Something went wrong")
      } else {
        setSessionForm(SESSION_DEFAULTS)
        sessionStatus.setSuccess("Session logged!")
      }
    } catch {
      sessionStatus.setError("Network error — try again")
    } finally {
      setSessionLoading(false)
    }
  }

  async function handleCheckinSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setCheckinLoading(true)
    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...checkinForm, gymId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        checkinStatus.setError(data.error ?? "Something went wrong")
      } else {
        setCheckinForm(CHECKIN_DEFAULTS)
        checkinStatus.setSuccess("Check-in submitted!")
      }
    } catch {
      checkinStatus.setError("Network error — try again")
    } finally {
      setCheckinLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">Log Training Session</h2>
        <StatusBanner successMsg={sessionStatus.successMsg} errorMsg={sessionStatus.errorMsg} />
        <form onSubmit={handleSessionSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Duration (minutes)</label>
            <input type="number" className={inputClass} value={sessionForm.duration} onChange={e => setSessionForm(prev => ({ ...prev, duration: Number(e.target.value) }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Intensity (1–10)</label>
            <input type="number" min={1} max={10} className={inputClass} value={sessionForm.intensity} onChange={e => setSessionForm(prev => ({ ...prev, intensity: Number(e.target.value) }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Type</label>
            <select className={inputClass} value={sessionForm.type} onChange={e => setSessionForm(prev => ({ ...prev, type: e.target.value }))}>
              {SESSION_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <button type="submit" disabled={sessionLoading} className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed">
            {sessionLoading ? "Logging…" : "Log Session"}
          </button>
        </form>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">Daily Check-in</h2>
        <StatusBanner successMsg={checkinStatus.successMsg} errorMsg={checkinStatus.errorMsg} />
        <form onSubmit={handleCheckinSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Sleep quality (1–10)</label>
            <input type="number" min={1} max={10} className={inputClass} value={checkinForm.sleep} onChange={e => setCheckinForm(prev => ({ ...prev, sleep: Number(e.target.value) }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Soreness (1–10)</label>
            <input type="number" min={1} max={10} className={inputClass} value={checkinForm.soreness} onChange={e => setCheckinForm(prev => ({ ...prev, soreness: Number(e.target.value) }))} />
          </div>
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Stress (1–10)</label>
            <input type="number" min={1} max={10} className={inputClass} value={checkinForm.stress} onChange={e => setCheckinForm(prev => ({ ...prev, stress: Number(e.target.value) }))} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={checkinForm.injury} onChange={e => setCheckinForm(prev => ({ ...prev, injury: e.target.checked }))} />
            <label className={labelClass}>Injury</label>
          </div>
          <button type="submit" disabled={checkinLoading} className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed">
            {checkinLoading ? "Submitting…" : "Submit Check-in"}
          </button>
        </form>
      </section>
    </div>
  )
}
