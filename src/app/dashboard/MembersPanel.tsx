"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"

type Role = "ATHLETE" | "COACH" | "ADMIN"

type Member = {
  membershipId: string
  userId: string
  name: string | null
  email: string | null
  image: string | null
  role: Role
}

const ROLE_RANK: Record<Role, number> = {
  ATHLETE: 1,
  COACH: 2,
  ADMIN: 3,
}

const REMOVE_ERRORS: Record<string, string> = {
  insufficient_role: "You don't have authority to remove that member.",
  last_admin: "Can't remove the only admin.",
  use_leave_endpoint: "Can't remove yourself — use Leave Gym on your profile.",
  not_a_member: "That member is no longer in the gym.",
}

const ROLE_CHANGE_ERRORS: Record<string, string> = {
  cant_modify_self: "Can't change your own role — ask another admin.",
  last_admin: "Can't demote the only admin.",
  not_a_member: "That member is no longer in the gym.",
  invalid_input: "That role isn't valid.",
}

export default function MembersPanel({
  gymId,
  currentUserId,
  currentUserRole,
}: {
  gymId: string
  currentUserId: string
  currentUserRole: Role
}) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null)

  async function refresh() {
    const res = await fetch(`/api/gyms/${gymId}/members`)
    if (res.ok) {
      const data = (await res.json()) as Member[]
      setMembers(data)
    }
  }

  useEffect(() => {
    let cancelled = false
    async function fetchInitial() {
      const res = await fetch(`/api/gyms/${gymId}/members`)
      if (!cancelled) {
        if (res.ok) {
          const data = (await res.json()) as Member[]
          setMembers(data)
        }
        setLoading(false)
      }
    }
    fetchInitial()
    return () => {
      cancelled = true
    }
  }, [gymId])

  async function handleRemove(userId: string) {
    setError(null)
    const res = await fetch(`/api/gyms/${gymId}/members/${userId}`, {
      method: "DELETE",
    })
    if (res.ok) {
      await refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      const key = typeof data?.error === "string" ? data.error : ""
      setError(REMOVE_ERRORS[key] ?? "Couldn't remove that member.")
    }
    setPendingRemoveId(null)
  }

  async function handleRoleChange(userId: string, role: Role) {
    setError(null)
    const res = await fetch(`/api/gyms/${gymId}/members/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
    if (res.ok) {
      await refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      const key = typeof data?.error === "string" ? data.error : ""
      setError(ROLE_CHANGE_ERRORS[key] ?? "Couldn't change that role.")
      await refresh()
    }
  }

  const adminCount = members.filter((m) => m.role === "ADMIN").length
  const myRank = ROLE_RANK[currentUserRole]

  function canRemove(m: Member): boolean {
    if (m.userId === currentUserId) return false
    if (myRank <= ROLE_RANK[m.role]) return false
    if (m.role === "ADMIN" && adminCount <= 1) return false
    return true
  }

  const canChangeRoles = currentUserRole === "ADMIN"

  function canChangeTargetRole(m: Member): boolean {
    if (!canChangeRoles) return false
    if (m.userId === currentUserId) return false
    return true
  }

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
          <span style={{ color: "var(--color-accent)" }}>§ 04</span> Members
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
          {members.length} total
        </span>
      </div>

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
      ) : members.length === 0 ? (
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--color-ink-muted)",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
          }}
        >
          — No members yet —
        </p>
      ) : (
        <div className="flex flex-col">
          <AnimatePresence initial={false}>
            {members.map((m) => {
              const isSelf = m.userId === currentUserId
              const removable = canRemove(m)
              return (
                <motion.div
                  key={m.userId}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-6 border-b py-4"
                  style={{ borderColor: "var(--color-rule)" }}
                >
                  <div className="flex flex-col gap-1">
                    <span
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                      }}
                    >
                      {m.name ?? m.email ?? "(unknown)"}
                      {isSelf && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            letterSpacing: "var(--tracking-label)",
                            textTransform: "uppercase",
                            color: "var(--color-accent)",
                            marginLeft: "10px",
                          }}
                        >
                          · You
                        </span>
                      )}
                    </span>
                    {m.email && m.name && (
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          color: "var(--color-ink-muted)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {m.email}
                      </span>
                    )}
                  </div>

                  {canChangeTargetRole(m) ? (
                    <select
                      value={m.role}
                      onChange={(e) =>
                        handleRoleChange(m.userId, e.target.value as Role)
                      }
                      className="border bg-transparent px-2 py-1 transition-colors hover:border-[var(--color-accent)] focus:border-[var(--color-accent)] focus:outline-none"
                      style={{
                        borderColor: "var(--color-rule-strong)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        letterSpacing: "var(--tracking-label)",
                        textTransform: "uppercase",
                        color:
                          m.role === "ADMIN"
                            ? "var(--color-accent)"
                            : "var(--color-ink)",
                      }}
                    >
                      <option value="ATHLETE">Athlete</option>
                      <option value="COACH">Coach</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        letterSpacing: "var(--tracking-label)",
                        textTransform: "uppercase",
                        color:
                          m.role === "ADMIN"
                            ? "var(--color-accent)"
                            : "var(--color-ink-muted)",
                      }}
                    >
                      {m.role}
                    </span>
                  )}

                  {pendingRemoveId === m.userId ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemove(m.userId)}
                        className="border px-3 py-2 transition-all hover:-translate-y-0.5"
                        style={{
                          backgroundColor: "#b91c1c",
                          borderColor: "#7f1d1d",
                          color: "var(--color-canvas)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "var(--tracking-label)",
                        }}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingRemoveId(null)}
                        className="border px-3 py-2 transition-all hover:-translate-y-0.5"
                        style={{
                          borderColor: "var(--color-ink)",
                          color: "var(--color-ink)",
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "var(--tracking-label)",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPendingRemoveId(m.userId)}
                      disabled={!removable}
                      className="border px-4 py-2 transition-all hover:-translate-y-0.5 disabled:opacity-30 disabled:hover:translate-y-0"
                      style={{
                        borderColor: "var(--color-ink)",
                        color: "var(--color-ink)",
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "var(--tracking-label)",
                        cursor: removable ? "pointer" : "not-allowed",
                      }}
                    >
                      Remove
                    </button>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
