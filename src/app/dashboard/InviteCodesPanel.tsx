"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

type CodeStatus = "active" | "revoked" | "expired" | "exhausted"

type InviteCode = {
  id: string
  code: string
  gymId: string
  role: "ATHLETE" | "COACH" | "ADMIN"
  maxUses: number | null
  usesCount: number
  expiresAt: string | null
  revokedAt: string | null
  createdAt: string
  status: CodeStatus
}

const STATUS_LABEL: Record<CodeStatus, string> = {
  active: "Active",
  revoked: "Revoked",
  expired: "Expired",
  exhausted: "Used up",
}

const STATUS_COLOR: Record<CodeStatus, string> = {
  active: "var(--color-accent)",
  revoked: "var(--color-ink-faint)",
  expired: "var(--color-ink-faint)",
  exhausted: "var(--color-ink-faint)",
}

export default function InviteCodesPanel({ gymId }: { gymId: string }) {
  const [codes, setCodes] = useState<InviteCode[]>([])
  const [loading, setLoading] = useState(true)
  const [maxUsesInput, setMaxUsesInput] = useState<string>("")
  const [expiresInDays, setExpiresInDays] = useState<string>("30")
  const [role, setRole] = useState<"ATHLETE" | "COACH" | "ADMIN">("ATHLETE")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function refreshCodes() {
    const res = await fetch(`/api/invite-codes?gymId=${gymId}`)
    if (res.ok) {
      const data = (await res.json()) as InviteCode[]
      setCodes(data)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function fetchInitial() {
      const res = await fetch(`/api/invite-codes?gymId=${gymId}`)
      if (!cancelled) {
        if (res.ok) {
          const data = (await res.json()) as InviteCode[]
          setCodes(data)
        }
        setLoading(false)
      }
    }
    fetchInitial()
    return () => {
      cancelled = true
    }
  }, [gymId])

  async function handleGenerate(e: React.SyntheticEvent) {
    e.preventDefault()
    setGenerating(true)
    setError(null)
    const body = {
      gymId,
      role,
      maxUses: maxUsesInput.trim() ? Number(maxUsesInput.trim()) : null,
      expiresInDays: expiresInDays.trim() ? Number(expiresInDays.trim()) : null,
    }
    const res = await fetch("/api/invite-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      setMaxUsesInput("")
      await refreshCodes()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? "Couldn't generate code")
    }
    setGenerating(false)
  }

  async function handleRevoke(id: string) {
    const res = await fetch(`/api/invite-codes/${id}`, { method: "DELETE" })
    if (res.ok) {
      await refreshCodes()
    }
  }

  async function handleCopy(code: string, id: string) {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(id)
      setTimeout(() => setCopiedId((v) => (v === id ? null : v)), 1400)
    } catch {
      // clipboard might be blocked; ignore
    }
  }

  const activeCodes = codes.filter((c) => c.status === "active")
  const otherCodes = codes.filter((c) => c.status !== "active")

  return (
    <section className="mb-16">
      <div
        className="mb-6 flex items-baseline justify-between border-b pb-3"
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
          <span style={{ color: "var(--color-accent)" }}>§ 03</span> Invite Codes
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--color-ink-faint)",
          }}
        >
          {activeCodes.length} active
        </span>
      </div>

      <form
        onSubmit={handleGenerate}
        className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end"
      >
        <Field label="Max uses (blank = unlimited)">
          <input
            type="number"
            min="1"
            value={maxUsesInput}
            onChange={(e) => setMaxUsesInput(e.target.value)}
            placeholder="∞"
            className="border-b bg-transparent py-2 outline-none transition-colors focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          />
        </Field>
        <Field label="Expires in (days)">
          <input
            type="number"
            min="1"
            max="365"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
            placeholder="never"
            className="border-b bg-transparent py-2 outline-none transition-colors focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          />
        </Field>
        <Field label="Role">
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "ATHLETE" | "COACH" | "ADMIN")
            }
            className="border-b bg-transparent py-2 outline-none transition-colors focus:border-[var(--color-accent)]"
            style={{
              borderColor: "var(--color-rule-strong)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-sans)",
              fontSize: "16px",
            }}
          >
            <option value="ATHLETE">Athlete</option>
            <option value="COACH">Coach</option>
            <option value="ADMIN">Admin</option>
          </select>
        </Field>
        <button
          type="submit"
          disabled={generating}
          className="group flex items-center justify-between gap-4 border px-5 py-3 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          style={{
            backgroundColor: "var(--color-accent)",
            borderColor: "var(--color-accent-hover)",
            color: "var(--color-accent-ink)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          <span>{generating ? "Generating…" : "Generate"}</span>
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </form>

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

      {loading ? (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--color-ink-faint)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          Loading…
        </p>
      ) : codes.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--color-ink-muted)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          — No codes yet —
        </p>
      ) : (
        <div className="flex flex-col">
          <AnimatePresence initial={false}>
            {[...activeCodes, ...otherCodes].map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-6 border-b py-4"
                style={{
                  borderColor: "var(--color-rule)",
                  opacity: c.status === "active" ? 1 : 0.55,
                }}
              >
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(c.code, c.id)}
                    className="group inline-flex items-center gap-3 self-start"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "20px",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      color: "var(--color-ink)",
                    }}
                  >
                    <span>{c.code}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "var(--tracking-label)",
                        textTransform: "uppercase",
                        color:
                          copiedId === c.id
                            ? "var(--color-accent)"
                            : "var(--color-ink-muted)",
                        opacity: copiedId === c.id ? 1 : 0.6,
                        transition: "color 0.2s ease, opacity 0.2s ease",
                      }}
                    >
                      {copiedId === c.id ? "copied" : "copy"}
                    </span>
                  </button>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      letterSpacing: "var(--tracking-label)",
                      textTransform: "uppercase",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {c.role}
                    <span style={{ color: "var(--color-ink-faint)" }}> · </span>
                    {c.maxUses === null
                      ? `${c.usesCount} used`
                      : `${c.usesCount} of ${c.maxUses}`}
                    {c.expiresAt && (
                      <>
                        <span style={{ color: "var(--color-ink-faint)" }}>
                          {" "}
                          ·{" "}
                        </span>
                        expires {new Date(c.expiresAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </>
                    )}
                  </span>
                </div>

                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    color: STATUS_COLOR[c.status],
                  }}
                >
                  {STATUS_LABEL[c.status]}
                </span>

                {c.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => handleRevoke(c.id)}
                    className="border px-4 py-2 transition-all hover:-translate-y-0.5"
                    style={{
                      borderColor: "var(--color-ink)",
                      color: "var(--color-ink)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "var(--tracking-label)",
                    }}
                  >
                    Revoke
                  </button>
                ) : (
                  <span style={{ width: "92px" }} aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
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
