import Link from "next/link"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import SignOutButton from "./SignOutButton"

export default async function Navbar() {
  const session = await auth()
  if (!session?.user?.id) return null

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
  })

  const isCoach = membership?.role === "COACH" || membership?.role === "ADMIN"

  return (
    <nav className="nav-bar px-8 flex items-stretch justify-between">
      <div className="flex items-stretch gap-10">
        <Link href="/" className="wordmark-frost text-xl flex items-center py-5 tracking-widest">
          MartialOps
        </Link>
        <div className="flex items-stretch gap-0.5">
          <Link href="/athlete" className="nav-link">Log Training</Link>
          {isCoach && <Link href="/dashboard" className="nav-link">Dashboard</Link>}
          {isCoach && <Link href="/dashboard/settings" className="nav-link">Settings</Link>}
          <Link href="/athlete/history" className="nav-link">Training History</Link>
          <Link href="/how-it-works" className="nav-link">How It Works</Link>
        </div>
      </div>
      <div className="flex items-center">
        <SignOutButton name={session.user.name ?? null} />
      </div>
    </nav>
  )
}
