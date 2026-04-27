"use client"

import { usePathname } from "next/navigation"
import Footer from "./Footer"

/**
 * Hides the footer on chrome-less routes (e.g. /login).
 * Client component so it can read the current pathname.
 */
const HIDE_ON_PATHS = new Set(["/login"])

export default function ConditionalFooter() {
  const pathname = usePathname()
  if (HIDE_ON_PATHS.has(pathname)) return null
  return <Footer />
}
