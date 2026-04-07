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
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-medium">Pending Requests</h2>
      <div className="flex flex-col gap-3">
        {requests.map(r => (
          <div key={r.userId} className="flex items-center justify-between rounded-lg border px-4 py-3">
            <span className="font-medium">{r.user.name ?? r.user.email}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(r.userId, r.gymId, "approve")}
                disabled={loading !== null}
                className="rounded-lg bg-black px-3 py-1 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {loading === `${r.userId}-approve` ? "…" : "Approve"}
              </button>
              <button
                onClick={() => handleAction(r.userId, r.gymId, "deny")}
                disabled={loading !== null}
                className="rounded-lg border px-3 py-1 text-sm hover:bg-zinc-100 disabled:opacity-50"
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
