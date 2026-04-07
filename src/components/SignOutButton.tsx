"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton({ name }: { name: string | null }) {
  return (
    <button onClick={() => signOut({ callbackUrl: "/login" })} className="nav-link gap-2">
      <span style={{ color: "rgba(148, 163, 184, 0.25)" }}>|</span>
      <span>{name ?? "Account"}</span>
      <span style={{ color: "rgba(148, 163, 184, 0.25)" }}>·</span>
      <span>Sign out</span>
    </button>
  )
}
