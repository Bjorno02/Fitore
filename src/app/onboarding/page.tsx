"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const inputClass = "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
const labelClass = "text-sm font-medium text-zinc-700"

type Gym = { id: string; name: string }

export default function OnboardingPage() {
  const router = useRouter()

  // Create gym state
  const [gymName, setGymName] = useState("")
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Search state
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<Gym[]>([])
  const [searching, setSearching] = useState(false)
  const [requestedId, setRequestedId] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<string | null>(null)

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
    const res = await fetch(`/api/gyms?search=${encodeURIComponent(search)}`)
    const data = await res.json().catch(() => [])
    setResults(data)
    setSearching(false)
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
    <main className="mx-auto max-w-lg px-6 py-16 flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold">Welcome to MartialOps</h1>
        <p className="mt-1 text-sm text-zinc-500">Create a gym or find one to join.</p>
      </div>

      {/* Create gym */}
      <section className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">Create a gym</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Gym name</label>
            <input
              type="text"
              className={inputClass}
              value={gymName}
              onChange={e => setGymName(e.target.value)}
              placeholder="e.g. Downtown BJJ"
            />
          </div>
          {createError && <p className="text-sm text-red-600">{createError}</p>}
          <button
            type="submit"
            disabled={creating || !gymName.trim()}
            className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Creating…" : "Create gym"}
          </button>
        </form>
      </section>

      {/* Find a gym */}
      <section className="rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-medium">Find a gym</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            className={inputClass}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name…"
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-zinc-100 disabled:opacity-50 shrink-0"
          >
            {searching ? "…" : "Search"}
          </button>
        </form>

        {requestError && <p className="mb-3 text-sm text-red-600">{requestError}</p>}

        {results.length > 0 ? (
          <div className="flex flex-col gap-3">
            {results.map(gym => (
              <div key={gym.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                <span className="font-medium">{gym.name}</span>
                <button
                  onClick={() => handleRequest(gym.id)}
                  disabled={requestedId !== null}
                  className="rounded-lg bg-black px-3 py-1 text-sm text-white hover:bg-zinc-800 disabled:opacity-50"
                >
                  {requestedId === gym.id ? "Requesting…" : "Request to Join"}
                </button>
              </div>
            ))}
          </div>
        ) : search && !searching ? (
          <p className="text-sm text-zinc-400">No gyms found.</p>
        ) : null}          

        {/* TODO(human): render the search results list here.
            `results` is Gym[] — each has { id: string, name: string }.
            For each gym, show the gym name and a "Request to Join" button.
            The button should call handleRequest(gym.id).
            Disable it while requestedId is set (a request is in flight).
            If results is empty and a search was made, show "No gyms found." */}
      </section>
    </main>
  )
}
