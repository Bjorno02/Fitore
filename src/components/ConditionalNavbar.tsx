"use client"

import { usePathname } from "next/navigation"
import { type ReactNode } from "react"

/**
 * Hides the navbar on chrome-less routes (e.g. /login).
 * The navbar itself is an async server component — we pass it as `children`
 * so it's server-rendered, then the client wrapper decides whether to mount it.
 */
const HIDE_ON_PATHS = new Set(["/login"])

export default function ConditionalNavbar({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (HIDE_ON_PATHS.has(pathname)) return null
  return <>{children}</>
}
