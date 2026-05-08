"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import type { ActivityDay } from "@/lib/history"

const SESSION_TYPES = ["sparring", "drilling", "conditioning", "weights"] as const

type Props = {
  days: [string, ActivityDay][]
}

export default function HistoryActivityLog({ days }: Props) {
  const router = useRouter()
  const [pending, setPending] = useState<string | null>(null)
  const [editing, setEditing] = useState<{
    kind: "session" | "checkin"
    id: string
    initial: Record<string, unknown>
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function deleteSession(id: string) {
    setPending(id)
    setError(null)
    const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" })
    if (res.ok) router.refresh()
    else {
      const data = await res.json().catch(() => ({}))
      setError(data?.error ?? "Couldn't delete session.")
    }
    setPending(null)
  }

  async function deleteCheckIn(id: string) {
    setPending(id)
    setError(null)
    const res = await fetch(`/api/checkins/${id}`, { method: "DELETE" })
    if (res.ok) router.refresh()
    else {
      const data = await res.json().catch(() => ({}))
      setError(data?.error ?? "Couldn't delete check-in.")
    }
    setPending(null)
  }

  async function patchSession(id: string, body: Record<string, unknown>) {
    setError(null)
    const res = await fetch(`/api/sessions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setEditing(null)
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data?.error ?? "Couldn't save session.")
    }
  }

  async function patchCheckIn(id: string, body: Record<string, unknown>) {
    setError(null)
    const res = await fetch(`/api/checkins/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setEditing(null)
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data?.error ?? "Couldn't save check-in.")
    }
  }

  if (days.length === 0) {
    return (
      <p
        className="py-12 text-center"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          letterSpacing: "var(--tracking-label)",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
        }}
      >
        — No activity logged yet —
      </p>
    )
  }

  return (
    <>
      {error && (
        <p
          className="mb-4"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            letterSpacing: "0.12em",
            color: "#b91c1c",
            textTransform: "uppercase",
          }}
        >
          ✗ {error}
        </p>
      )}

      <AnimatePresence initial={false}>
        {days.flatMap(([dateStr, entry]) => {
          const display = new Date(dateStr + "T12:00:00Z").toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" },
          )
          const checkInDetail = entry.checkIn
            ? `Sleep ${entry.checkIn.sleep} · Sore ${entry.checkIn.soreness}${entry.checkIn.injury ? " · Injury" : ""}`
            : null

          if (entry.sessions.length === 0 && entry.checkIn) {
            const ci = entry.checkIn
            return [
              <motion.div
                key={`${dateStr}-checkin`}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b py-4"
                style={{ borderColor: "var(--color-rule)" }}
              >
                <Row
                  display={display}
                  badge="Check-in only"
                  detail={checkInDetail}
                  busy={pending === ci.id}
                  onEdit={
                    ci.id
                      ? () =>
                          setEditing({
                            kind: "checkin",
                            id: ci.id!,
                            initial: ci as unknown as Record<string, unknown>,
                          })
                      : undefined
                  }
                  onDelete={ci.id ? () => deleteCheckIn(ci.id!) : undefined}
                />
              </motion.div>,
            ]
          }

          return entry.sessions.map((sess, i) => (
            <motion.div
              key={sess.id ?? `${dateStr}-${i}`}
              layout
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b py-4"
              style={{ borderColor: "var(--color-rule)" }}
            >
              <Row
                display={display}
                badge={sess.type}
                badgeAccent
                detail={`${sess.duration}min · ×${sess.intensity}${i === 0 && checkInDetail ? ` · ${checkInDetail}` : ""}${i === 0 && !checkInDetail ? " · No check-in" : ""}`}
                busy={pending === sess.id}
                onEdit={
                  sess.id
                    ? () =>
                        setEditing({
                          kind: "session",
                          id: sess.id!,
                          initial: sess as unknown as Record<string, unknown>,
                        })
                    : undefined
                }
                onDelete={sess.id ? () => deleteSession(sess.id!) : undefined}
              />
            </motion.div>
          ))
        })}
      </AnimatePresence>

      {editing && editing.kind === "session" && (
        <SessionEditModal
          initial={editing.initial as { duration: number; intensity: number; type: string }}
          onCancel={() => setEditing(null)}
          onSave={(body) => patchSession(editing.id, body)}
        />
      )}
      {editing && editing.kind === "checkin" && (
        <CheckInEditModal
          initial={
            editing.initial as {
              sleep: number
              soreness: number
              stress: number
              injury: boolean
            }
          }
          onCancel={() => setEditing(null)}
          onSave={(body) => patchCheckIn(editing.id, body)}
        />
      )}
    </>
  )
}

function Row({
  display,
  badge,
  badgeAccent,
  detail,
  busy,
  onEdit,
  onDelete,
}: {
  display: string
  badge: string
  badgeAccent?: boolean
  detail: string | null
  busy: boolean
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <>
      <div className="mb-1 flex items-baseline justify-between gap-4">
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 600,
            fontSize: "16px",
            color: "var(--color-ink)",
          }}
        >
          {display}
        </span>
        <span
          className={badgeAccent ? "flex items-baseline gap-1.5 border px-2.5 py-1" : ""}
          style={
            badgeAccent
              ? {
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  borderColor: "var(--color-accent)",
                  backgroundColor: "var(--color-accent-soft)",
                }
              : {
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-faint)",
                }
          }
        >
          {badge}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-ink-muted)",
          }}
        >
          {detail}
        </p>
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                disabled={busy}
                className="border px-3 py-2.5 transition-all hover:-translate-y-0.5 disabled:opacity-30"
                style={{
                  borderColor: "var(--color-rule-strong)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  minHeight: "44px",
                }}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                disabled={busy}
                className="border px-3 py-2.5 transition-all hover:-translate-y-0.5 disabled:opacity-30"
                style={{
                  borderColor: "var(--color-rule-strong)",
                  color: "#b91c1c",
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  minHeight: "44px",
                }}
              >
                {busy ? "..." : "Delete"}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function ModalShell({
  title,
  onCancel,
  children,
}: {
  title: string
  onCancel: () => void
  children: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border p-6"
        style={{
          backgroundColor: "var(--color-canvas-raised)",
          borderColor: "var(--color-rule-strong)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          className="mb-5 flex items-baseline justify-between border-b pb-3"
          style={{ borderColor: "var(--color-rule-strong)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
            }}
          >
            <span style={{ color: "var(--color-accent)" }}>§</span> {title}
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

function SessionEditModal({
  initial,
  onCancel,
  onSave,
}: {
  initial: { duration: number; intensity: number; type: string }
  onCancel: () => void
  onSave: (body: { duration: number; intensity: number; type: string }) => void
}) {
  const [duration, setDuration] = useState(String(initial.duration))
  const [intensity, setIntensity] = useState(String(initial.intensity))
  const [type, setType] = useState(initial.type)

  return (
    <ModalShell title="Edit Session" onCancel={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            duration: Number(duration),
            intensity: Number(intensity),
            type,
          })
        }}
        className="flex flex-col gap-4"
      >
        <Field label="Duration (min)">
          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border-b bg-transparent py-2 outline-none focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          />
        </Field>
        <Field label="Intensity (1-10)">
          <input
            type="number"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
            className="border-b bg-transparent py-2 outline-none focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          />
        </Field>
        <Field label="Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border-b bg-transparent py-2 outline-none focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          >
            {SESSION_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <ModalActions onCancel={onCancel} />
      </form>
    </ModalShell>
  )
}

function CheckInEditModal({
  initial,
  onCancel,
  onSave,
}: {
  initial: { sleep: number; soreness: number; stress: number; injury: boolean }
  onCancel: () => void
  onSave: (body: {
    sleep: number
    soreness: number
    stress: number
    injury: boolean
  }) => void
}) {
  const [sleep, setSleep] = useState(String(initial.sleep))
  const [soreness, setSoreness] = useState(String(initial.soreness))
  const [stress, setStress] = useState(String(initial.stress))
  const [injury, setInjury] = useState(initial.injury)

  return (
    <ModalShell title="Edit Check-in" onCancel={onCancel}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave({
            sleep: Number(sleep),
            soreness: Number(soreness),
            stress: Number(stress),
            injury,
          })
        }}
        className="flex flex-col gap-4"
      >
        <Field label="Sleep (1-10)">
          <input
            type="number"
            min="1"
            max="10"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            className="border-b bg-transparent py-2 outline-none focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          />
        </Field>
        <Field label="Soreness (1-10)">
          <input
            type="number"
            min="1"
            max="10"
            value={soreness}
            onChange={(e) => setSoreness(e.target.value)}
            className="border-b bg-transparent py-2 outline-none focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          />
        </Field>
        <Field label="Stress (1-10)">
          <input
            type="number"
            min="1"
            max="10"
            value={stress}
            onChange={(e) => setStress(e.target.value)}
            className="border-b bg-transparent py-2 outline-none focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          />
        </Field>
        <label
          className="flex items-center gap-2"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--color-ink)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          <input
            type="checkbox"
            checked={injury}
            onChange={(e) => setInjury(e.target.checked)}
          />
          Injury
        </label>
        <ModalActions onCancel={onCancel} />
      </form>
    </ModalShell>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function ModalActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="mt-4 flex justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="border px-4 py-2.5 transition-all hover:-translate-y-0.5"
        style={{
          borderColor: "var(--color-ink)",
          color: "var(--color-ink)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-label)",
          minHeight: "44px",
        }}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="border px-4 py-2.5 transition-all hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--color-accent)",
          borderColor: "var(--color-accent-hover)",
          color: "var(--color-accent-ink)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "var(--tracking-label)",
          minHeight: "44px",
        }}
      >
        Save
      </button>
    </div>
  )
}
