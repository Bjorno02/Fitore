"use client"

import { motion } from "motion/react"
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
  sessions: {
    type: string
    duration: number
    intensity: number
    load: number
  }[]
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

export default function CalendarPanel({
  gymId,
  initialMonthSummary,
  initialDate,
}: Props) {
  const initView = new Date(initialDate + "T12:00:00Z")
  const [viewDate, setViewDate] = useState(initView)
  const [monthSummary, setMonthSummary] =
    useState<Record<string, number>>(initialMonthSummary)
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
  const month = viewDate.getMonth()
  const cells = buildCalendarGrid(year, month)

  const todayStr = new Date().toISOString().split("T")[0]

  const selectedDisplay = selectedDate
    ? new Date(selectedDate + "T12:00:00Z").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="border-t pt-6"
      style={{ borderColor: "var(--color-rule-strong)" }}
    >
      <div
        className="mb-8 flex items-center gap-3"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
        }}
      >
        <span style={{ color: "var(--color-accent)" }}>§ B</span>
        <span>Monthly Activity</span>
        {loadingMonth && (
          <span className="ml-2" style={{ color: "var(--color-ink-faint)" }}>
            · loading
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
        {/* Calendar */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              disabled={loadingMonth}
              aria-label="Previous month"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center border px-3 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              style={{
                borderColor: "var(--color-ink)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.2em",
              }}
            >
              ←
            </button>
            <span
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "20px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--color-ink)",
              }}
            >
              {MONTH_NAMES[month]} <span style={{ color: "var(--color-ink-faint)" }}>·</span>{" "}
              {year}
            </span>
            <button
              onClick={handleNextMonth}
              disabled={loadingMonth}
              aria-label="Next month"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center border px-3 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
              style={{
                borderColor: "var(--color-ink)",
                color: "var(--color-ink)",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.2em",
              }}
            >
              →
            </button>
          </div>

          {/* Weekday headers */}
          <div className="mb-2 grid grid-cols-7 gap-1">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div
                key={d}
                className="text-center"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-faint)",
                  paddingBottom: "4px",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={`blank-${i}`} />
              const count = monthSummary[date] ?? 0
              const hasData = count > 0
              const isSelected = date === selectedDate
              const isToday = date === todayStr
              return (
                <button
                  key={date}
                  onClick={() => handleDayClick(date)}
                  aria-label={`Select ${date}`}
                  className="relative flex flex-col items-center justify-center border transition-all"
                  style={{
                    aspectRatio: "1",
                    backgroundColor: isSelected
                      ? "var(--color-accent)"
                      : hasData
                        ? "var(--color-accent-soft)"
                        : "transparent",
                    borderColor: isSelected
                      ? "var(--color-accent-hover)"
                      : isToday
                        ? "var(--color-ink)"
                        : hasData
                          ? "var(--color-accent)"
                          : "var(--color-rule)",
                    color: isSelected
                      ? "var(--color-accent-ink)"
                      : "var(--color-ink)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-barlow)",
                      fontWeight: 700,
                      fontSize: "14px",
                      lineHeight: 1,
                    }}
                  >
                    {new Date(date + "T12:00:00Z").getDate()}
                  </span>
                  {hasData && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "9px",
                        lineHeight: 1.5,
                        opacity: 0.7,
                      }}
                    >
                      {count}
                    </span>
                  )}
                  {isToday && !isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 h-1 w-1 rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Day panel */}
        <div>
          <div
            className="mb-6 flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-rule-strong)" }}
          >
            <span
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "var(--text-display-sm)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-display)",
                color: "var(--color-ink)",
              }}
            >
              {selectedDisplay ?? "Select a day"}
            </span>
            {dayData && dayData.length > 0 && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-eyebrow)",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                }}
              >
                {dayData.length} athlete{dayData.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {loadingDay ? (
            <p
              className="py-8 text-center"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
              }}
            >
              · loading ·
            </p>
          ) : !dayData || dayData.length === 0 ? (
            <p
              className="py-8 text-center"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
              }}
            >
              — No activity logged —
            </p>
          ) : (
            <div>
              {dayData.map((athlete, i) => (
                <div
                  key={athlete.userId}
                  className="border-b py-5"
                  style={{
                    borderColor:
                      i === dayData.length - 1
                        ? "var(--color-rule-strong)"
                        : "var(--color-rule)",
                  }}
                >
                  <div className="mb-2 flex items-baseline justify-between gap-4">
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "16px",
                        color: "var(--color-ink)",
                      }}
                    >
                      {athlete.name ?? "Unknown"}
                    </span>
                    {athlete.checkIn && (
                      <span
                        className="flex items-baseline gap-1.5"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          letterSpacing: "0.15em",
                          textTransform: "uppercase",
                          color: "var(--color-ink-muted)",
                        }}
                      >
                        <span>Ready</span>
                        <span
                          style={{
                            fontFamily: "var(--font-barlow)",
                            fontWeight: 800,
                            fontSize: "20px",
                            color: "var(--color-accent)",
                            lineHeight: 1,
                          }}
                        >
                          {athlete.checkIn.readiness}
                        </span>
                      </span>
                    )}
                  </div>
                  <p
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {athlete.checkIn
                      ? `Sleep ${athlete.checkIn.sleep} · Sore ${athlete.checkIn.soreness} · Stress ${athlete.checkIn.stress}${athlete.checkIn.injury ? " · Injury" : ""}`
                      : "— No check-in —"}
                  </p>
                  {athlete.sessions.length === 0 ? (
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-ink-faint)",
                      }}
                    >
                      — No session —
                    </p>
                  ) : (
                    athlete.sessions.map((s, si) => (
                      <div
                        key={si}
                        className="mt-1 flex items-baseline justify-between"
                      >
                        <p
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "12px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "var(--color-ink)",
                          }}
                        >
                          {s.type} · {s.duration}min · ×{s.intensity}
                        </p>
                        <span
                          style={{
                            fontFamily: "var(--font-barlow)",
                            fontWeight: 700,
                            fontSize: "18px",
                            color: "var(--color-ink)",
                            lineHeight: 1,
                          }}
                        >
                          {s.load}
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "10px",
                              letterSpacing: "0.2em",
                              color: "var(--color-ink-faint)",
                              marginLeft: "4px",
                            }}
                          >
                            LOAD
                          </span>
                        </span>
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
