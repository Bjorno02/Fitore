"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Request = {
  userId: string
  gymId: string
  user: { id: string; name: string | null; email: string | null }
}

export default function PendingRequests({ requests }: { requests: Request[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  if (requests.length === 0) return null

  async function handleAction(
    userId: string,
    gymId: string,
    action: "approve" | "deny",
  ) {
    setLoading(`${userId}-${action}`)
    await fetch(`/api/gyms/${gymId}/requests/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <section className="mb-16 border-t pt-6" style={{ borderColor: "var(--color-rule-strong)" }}>
      <div
        className="mb-6 flex items-center gap-3"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
        }}
      >
        <span style={{ color: "var(--color-accent)" }}>§ A</span>
        <span>Pending Approvals</span>
        <span
          aria-hidden="true"
          className="relative ml-2 inline-flex h-2 w-2"
        >
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
        </span>
        <span
          className="ml-2"
          style={{
            color: "var(--color-ink)",
            fontWeight: 700,
          }}
        >
          {String(requests.length).padStart(2, "0")}
        </span>
      </div>

      <div>
        {requests.map((r, i) => (
          <div
            key={r.userId}
            className="flex items-center justify-between border-b py-5"
            style={{
              borderColor:
                i === requests.length - 1
                  ? "var(--color-rule-strong)"
                  : "var(--color-rule)",
            }}
          >
            <div className="flex items-baseline gap-4">
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-faint)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "var(--color-ink)",
                }}
              >
                {r.user.name ?? r.user.email}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleAction(r.userId, r.gymId, "approve")}
                disabled={loading !== null}
                className="group flex items-center gap-2 border px-4 py-2 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                style={{
                  backgroundColor: "var(--color-accent)",
                  borderColor: "var(--color-accent-hover)",
                  color: "var(--color-accent-ink)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-label)",
                }}
              >
                <span>
                  {loading === `${r.userId}-approve` ? "…" : "Approve"}
                </span>
              </button>
              <button
                onClick={() => handleAction(r.userId, r.gymId, "deny")}
                disabled={loading !== null}
                className="border px-4 py-2 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "var(--color-ink)",
                  color: "var(--color-ink)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "var(--tracking-label)",
                }}
              >
                {loading === `${r.userId}-deny` ? "…" : "Deny"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
