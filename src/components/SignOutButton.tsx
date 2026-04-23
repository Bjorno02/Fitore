"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton({ name }: { name: string | null }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-3 px-2 py-5 transition-opacity hover:opacity-100"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "var(--color-ink)",
        opacity: 0.7,
      }}
    >
      <span style={{ opacity: 0.6 }}>{name ?? "Account"}</span>
      <span aria-hidden="true" style={{ color: "var(--color-ink-faint)" }}>·</span>
      <span style={{ color: "var(--color-accent)" }}>Sign out</span>
    </button>
  )
}
