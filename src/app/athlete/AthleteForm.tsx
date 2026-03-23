"use client"

import { useState } from "react"

const inputClass = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
const labelClass = "text-sm font-medium text-zinc-700"

export default function AthleteForm({ gymId }: { gymId: string }) {
  const [sessionForm, setSessionForm] = useState({ duration: 0, intensity: 5, type: "drilling" })
  const [checkinForm, setCheckinForm] = useState({ sleep: 5, soreness: 5, stress: 5, injury: false })
  const [status, setStatus] = useState("")

  async function handleSessionSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...sessionForm, gymId }) })
    setStatus("Session logged!")
  }

  async function handleCheckinSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    await fetch("/api/checkins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...checkinForm, gymId }) })
    setStatus("Check-in submitted!")
  }

  return (
    <div className="flex flex-col gap-8">
      {status && <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{status}</p>}

      <section className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">Log Training Session</h2>
        <form onSubmit={handleSessionSubmit} className="flex flex-col gap-4">
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
            <input type="text" className={inputClass} value={sessionForm.type} onChange={e => setSessionForm(prev => ({ ...prev, type: e.target.value }))} />
          </div>
          <button type="submit" className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800">Log Session</button>
        </form>
      </section>

      <section className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">Daily Check-in</h2>
        <form onSubmit={handleCheckinSubmit} className="flex flex-col gap-4">
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
          <button type="submit" className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800">Submit Check-in</button>
        </form>
      </section>
    </div>
  )
}
