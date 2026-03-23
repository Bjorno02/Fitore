"use client"

import { useState } from "react"

export default function AthleteForm({ gymId }: { gymId: string }) {
  const [sessionForm, setSessionForm] = useState({
    duration: 0,
    intensity: 5,
    type: "drilling",
  })

  const [checkinForm, setCheckinForm] = useState({
    sleep: 5,
    soreness: 5,
    stress: 5,
    injury: false,
  })

  async function handleSessionSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    await fetch("/api/sessions", { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify({...sessionForm, gymId})})
  }

  async function handleCheckinSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    await fetch("/api/checkins", { method: "POST", headers: { "Content-Type": "application/json"}, body: JSON.stringify({...checkinForm, gymId})})

  }

  return (
    <div>
      <section>
        <h2>Log Training Session</h2>
        <form onSubmit={handleSessionSubmit}>
          <input type = "number" value={sessionForm.duration} onChange = {e => setSessionForm(prev => ({ ...prev, duration: Number(e.target.value) }))} />
          <input type = "number" value={sessionForm.intensity} onChange = {e => setSessionForm(prev => ({ ...prev, intensity: Number(e.target.value) }))} />
          <input type = "text" value={sessionForm.type} onChange = {e => setSessionForm(prev => ({ ...prev, type: String(e.target.value) }))} />
          <button type="submit">Log Session</button>
        </form>
      </section>

      <section>
        <h2>Daily Check-in</h2>
        <form onSubmit={handleCheckinSubmit}>
          <input type = "number" value={checkinForm.sleep} onChange = {e => setCheckinForm(prev => ({ ...prev, sleep: Number(e.target.value) }))} />
          <input type = "number" value={checkinForm.soreness} onChange = {e => setCheckinForm(prev => ({ ...prev, soreness: Number(e.target.value) }))} />
          <input type = "number" value={checkinForm.stress} onChange = {e => setCheckinForm(prev => ({ ...prev, stress: Number(e.target.value) }))} />
          <input type = "checkbox" checked={checkinForm.injury} onChange = {e => setCheckinForm(prev => ({ ...prev, injury: Boolean(e.target.checked) }))} />
          <button type = "submit">Submit Check-in</button>
        </form>
      </section>
    </div>
  )
}
