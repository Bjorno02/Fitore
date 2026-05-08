"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const LEAVE_ERRORS: Record<string, string> = {
  last_admin: "You're the only admin — promote someone else or close the gym first.",
  not_a_member: "You're not a member of this gym anymore.",
  missing_gymId: "Couldn't determine which gym to leave.",
}

export default function LeaveGymButton({
  gymId,
  gymName,
}: {
  gymId: string
  gymName: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLeave() {
    setLeaving(true)
    setError(null)
    const res = await fetch(`/api/memberships/me?gymId=${gymId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      router.push("/onboarding")
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      const key = typeof data?.error === "string" ? data.error : ""
      setError(LEAVE_ERRORS[key] ?? "Couldn't leave that gym.")
      setLeaving(false)
      setConfirming(false)
    }
  }

  if (!confirming) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="group inline-flex items-center gap-3 border px-5 py-3.5 transition-all hover:-translate-y-0.5"
          style={{
            borderColor: "var(--color-rule-strong)",
            color: "var(--color-ink-soft)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          <span>Leave {gymName}</span>
        </button>
        {error && (
          <p
            className="mt-4 max-w-lg"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.08em",
              color: "#b91c1c",
              textTransform: "uppercase",
            }}
          >
            ✗ {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div>
      <p
        className="mb-5 max-w-xl"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "16px",
          color: "var(--color-ink-soft)",
        }}
      >
        Leave <strong style={{ color: "var(--color-ink)" }}>{gymName}</strong>? You&apos;ll need a new invite code to rejoin. Your past sessions and check-ins stay where they are.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleLeave}
          disabled={leaving}
          className="group flex items-center gap-3 border px-5 py-3.5 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          style={{
            backgroundColor: "#b91c1c",
            borderColor: "#7f1d1d",
            color: "var(--color-canvas)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          <span>{leaving ? "Leaving…" : "Confirm Leave"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setConfirming(false)
            setError(null)
          }}
          disabled={leaving}
          className="border px-5 py-3.5 transition-all hover:-translate-y-0.5 disabled:opacity-40"
          style={{
            borderColor: "var(--color-ink)",
            color: "var(--color-ink)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
