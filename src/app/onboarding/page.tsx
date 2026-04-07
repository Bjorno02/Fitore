"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Gym = { id: string; name: string }

export default function OnboardingPage() {
  const router = useRouter()

  const [gymName, setGymName] = useState("")
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Gym[]>([])
  const [searching, setSearching] = useState(false)
  const [requestedId, setRequestedId] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleCreate(e: React.SyntheticEvent) {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)
    const res = await fetch("/api/gyms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: gymName }),
    })
    if (res.ok) {
      router.push("/")
    } else {
      const data = await res.json().catch(() => ({}))
      setCreateError(data.error ?? "Something went wrong")
      setCreating(false)
    }
  }

  async function handleSearch(e: React.SyntheticEvent) {
    e.preventDefault()
    setSearching(true)
    setSearched(false)
    const res = await fetch(`/api/gyms?search=${encodeURIComponent(search)}`)
    const data = await res.json().catch(() => [])
    setResults(data)
    setSearching(false)
    setSearched(true)
  }

  async function handleRequest(gymId: string) {
    setRequestedId(gymId)
    setRequestError(null)
    const res = await fetch(`/api/gyms/${gymId}/requests`, { method: "POST" })
    if (res.ok) {
      router.push("/")
    } else {
      const data = await res.json().catch(() => ({}))
      setRequestError(data.error ?? "Something went wrong")
      setRequestedId(null)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">

        <div className="text-center frost-enter">
          <p className="wordmark-frost text-4xl tracking-widest">MartialOps</p>
          <p className="text-text-muted text-sm mt-3">Create a gym or request to join one.</p>
        </div>

        <div className="w-20 h-px mx-auto frost-enter"
          style={{ background: "linear-gradient(90deg, transparent, #2563eb, transparent)" }} />

        <section className="frost-card rounded-xl overflow-hidden frost-enter-2">
          <div className="frost-card-header px-6 py-3.5">
            <p className="frost-label">Create a gym</p>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="frost-label">Gym name</label>
                <input type="text" className="frost-input" value={gymName}
                  onChange={e => setGymName(e.target.value)} placeholder="e.g. Downtown BJJ" />
              </div>
              {createError && <p className="text-sm" style={{ color: "#dc2626" }}>{createError}</p>}
              <button type="submit" disabled={creating || !gymName.trim()} className="btn-frost-primary">
                {creating ? "Creating…" : "Create gym"}
              </button>
            </form>
          </div>
        </section>

        <section className="frost-card rounded-xl overflow-hidden frost-enter-3">
          <div className="frost-card-header px-6 py-3.5">
            <p className="frost-label">Find a gym</p>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input type="text" className="frost-input" value={search}
                onChange={e => setSearch(e.target.value)} placeholder="Search by name…" />
              <button type="submit" disabled={searching} className="btn-frost-ghost shrink-0">
                {searching ? "…" : "Search"}
              </button>
            </form>

            {requestError && <p className="text-sm" style={{ color: "#dc2626" }}>{requestError}</p>}

            {results.length > 0 ? (
              <div className="frost-card rounded-lg overflow-hidden">
                {results.map((gym, i) => (
                  <div key={gym.id}
                    className={`flex items-center justify-between px-4 py-3 ${i !== results.length - 1 ? "frost-row" : ""}`}>
                    <span className="font-semibold text-text-primary text-sm">{gym.name}</span>
                    <button onClick={() => handleRequest(gym.id)} disabled={requestedId !== null}
                      className="btn-frost-primary text-xs px-3 py-1.5">
                      {requestedId === gym.id ? "Requesting…" : "Request to Join"}
                    </button>
                  </div>
                ))}
              </div>
            ) : searched && !searching ? (
              <p className="text-text-muted text-sm text-center py-2">No gyms found.</p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}
