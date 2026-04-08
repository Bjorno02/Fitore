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

  async function handleAction(userId: string, gymId: string, action: "approve" | "deny") {
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
    <section className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <p className="frost-label">Pending Requests</p>
        <span className="badge-load text-xs px-2.5 py-0.5 rounded-full">{requests.length}</span>
      </div>
      <div className="frost-card rounded-xl overflow-hidden">
        {requests.map((r, i) => (
          <div key={r.userId} className={`flex items-center justify-between px-5 py-3.5 ${i !== requests.length - 1 ? "frost-row" : ""}`}>
            <span className="font-semibold text-text-primary text-sm">{r.user.name ?? r.user.email}</span>
            <div className="flex gap-2">
              <button onClick={() => handleAction(r.userId, r.gymId, "approve")} disabled={loading !== null}
                className="btn-frost-primary text-xs px-4 py-1.5">
                {loading === `${r.userId}-approve` ? "…" : "Approve"}
              </button>
              <button onClick={() => handleAction(r.userId, r.gymId, "deny")} disabled={loading !== null}
                className="btn-frost-ghost text-xs px-4 py-1.5">
                {loading === `${r.userId}-deny` ? "…" : "Deny"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
