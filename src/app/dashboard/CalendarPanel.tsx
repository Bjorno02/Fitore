// src/app/dashboard/CalendarPanel.tsx
"use client"

import { useState, useEffect, useRef } from "react"

type AthleteDay = {
  userId: string
  name: string | null
  checkIn?: {
    sleep: number
    soreness: number
    stress: number
    injury: boolean
    readiness: number
  }
  session?: {
    type: string
    duration: number
    intensity: number
    load: number
  }
}

type Props = {
  gymId: string
  initialMonthSummary: Record<string, number>
  initialDate: string
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function toMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

// Returns array of date strings (YYYY-MM-DD) or null for blank cells.
// Calendar is Monday-first.
function buildCalendarGrid(year: number, month: number): (string | null)[] {
  const firstDayOfWeek = new Date(year, month, 1).getDay() // 0=Sun
  const offset = (firstDayOfWeek + 6) % 7 // 0=Mon offset
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array(offset).fill(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    )
  }
  return cells
}

export default function CalendarPanel({ gymId, initialMonthSummary, initialDate }: Props) {
  // Parse initialDate as UTC noon to avoid timezone date shifts
  const initView = new Date(initialDate + "T12:00:00Z")
  const [viewDate, setViewDate] = useState(initView)
  const [monthSummary, setMonthSummary] = useState<Record<string, number>>(initialMonthSummary)
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [dayData, setDayData] = useState<AthleteDay[] | null>(null)
  const [loadingDay, setLoadingDay] = useState(false)
  const [loadingMonth, setLoadingMonth] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    fetchDay(initialDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDate, gymId])

  async function fetchDay(date: string) {
    setLoadingDay(true)
    try {
      const res = await fetch(`/api/dashboard/day?gymId=${gymId}&date=${date}`)
      const data = await res.json().catch(() => [])
      setDayData(res.ok ? data : [])
    } catch {
      setDayData([])
    } finally {
      setLoadingDay(false)
    }
  }

  async function fetchMonthSummary(d: Date, signal?: AbortSignal) {
    setLoadingMonth(true)
    try {
      const res = await fetch(
        `/api/dashboard/summary?gymId=${gymId}&month=${toMonthKey(d)}`,
        signal ? { signal } : {}
      )
      const data = await res.json().catch(() => ({}))
      setMonthSummary(res.ok ? data : {})
    } catch (e) {
      if ((e as Error).name !== "AbortError") setMonthSummary({})
    } finally {
      setLoadingMonth(false)
    }
  }

  function handleDayClick(date: string) {
    setSelectedDate(date)
    fetchDay(date)
  }

  function handlePrevMonth() {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
    setViewDate(d)
    fetchMonthSummary(d, abortRef.current.signal)
  }

  function handleNextMonth() {
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
    setViewDate(d)
    fetchMonthSummary(d, abortRef.current.signal)
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth() // 0-indexed
  const cells = buildCalendarGrid(year, month)

  const selectedDisplay = selectedDate
    ? new Date(selectedDate + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 frost-enter-3">

      {/* Calendar */}
      <div className="frost-card rounded-2xl overflow-hidden" style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}>
        <div className="frost-card-header px-5 py-3.5 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            disabled={loadingMonth}
            aria-label="Previous month"
            className="btn-frost-ghost px-3 py-1 text-xs"
          >←</button>
          <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>{MONTH_NAMES[month]} {year}</p>
          <button
            onClick={handleNextMonth}
            disabled={loadingMonth}
            aria-label="Next month"
            className="btn-frost-ghost px-3 py-1 text-xs"
          >→</button>
        </div>
        <div className="px-4 py-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (
              <div key={d} className="text-center text-xs"
                style={{ color: "rgba(148,163,184,0.65)" }}>{d}</div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={`blank-${i}`} />
              const count = monthSummary[date] ?? 0
              const hasData = count > 0
              const isSelected = date === selectedDate
              return (
                <button
                  key={date}
                  onClick={() => handleDayClick(date)}
                  aria-label={`Select ${date}`}
                  className="relative flex flex-col items-center justify-center rounded-lg py-1.5 text-xs transition-all"
                  style={{
                    background: isSelected
                      ? "rgba(34,197,94,0.25)"
                      : hasData
                        ? "rgba(34,197,94,0.08)"
                        : "transparent",
                    color: hasData ? "#86efac" : "#475569",
                    border: isSelected ? "1px solid #22c55e" : "1px solid transparent",
                  }}
                >
                  <span>{new Date(date + "T12:00:00Z").getDate()}</span>
                  {hasData && (
                    <span className="text-[9px] leading-none mt-0.5"
                      style={{ color: "rgba(134,239,172,0.7)" }}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Day panel */}
      <div className="frost-card rounded-2xl overflow-hidden" style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}>
        <div className="frost-card-header px-5 py-3.5">
          <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>{selectedDisplay ?? "Select a day"}</p>
        </div>
        <div className="px-5 py-4">
          {loadingDay ? (
            <p className="text-text-muted text-sm text-center py-6">Loading…</p>
          ) : !dayData || dayData.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-6">
              No activity logged for this day.
            </p>
          ) : (
            dayData.map((athlete, i) => (
              <div
                key={athlete.userId}
                className={`py-3.5 ${i !== dayData.length - 1 ? "frost-row" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-text-primary">
                    {athlete.name ?? "Unknown"}
                  </span>
                  <div className="flex gap-2">
                    {athlete.checkIn && (
                      <span className="text-xs px-2.5 py-0.5 rounded-lg"
                        style={{ background: "rgba(34,197,94,0.12)", color: "#86efac" }}>
                        {athlete.checkIn.readiness} ready
                      </span>
                    )}
                    {athlete.session && (
                      <span className="text-xs px-2.5 py-0.5 rounded-lg"
                        style={{ background: "rgba(59,130,246,0.12)", color: "#93c5fd" }}>
                        {athlete.session.load} load
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs" style={{ color: "rgba(148,163,184,0.82)" }}>
                  {athlete.checkIn
                    ? `sleep ${athlete.checkIn.sleep} · soreness ${athlete.checkIn.soreness} · stress ${athlete.checkIn.stress}${athlete.checkIn.injury ? " · injury" : ""}`
                    : "no check-in"}
                  {athlete.session
                    ? ` · ${athlete.session.type} ${athlete.session.duration}min ×${athlete.session.intensity}`
                    : " · no session"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
