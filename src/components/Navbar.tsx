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
    <nav
      className="border-b-2 border-nav-stripe px-6 flex items-stretch justify-between"
      style={{
        background: "linear-gradient(180deg, #0a1628 0%, #0f1c2e 100%)",
        boxShadow: "0 4px 24px rgba(10, 22, 40, 0.4), 0 1px 0 rgba(37, 99, 235, 0.3)",
      }}
    >
      <div className="flex items-stretch gap-8">
        <Link href="/" className="wordmark-frost text-lg flex items-center py-3.5">
          MartialOps
        </Link>
        <div className="flex items-stretch gap-1">
          <Link href="/athlete" className="nav-link">Log Training</Link>
          {isCoach && <Link href="/dashboard" className="nav-link">Dashboard</Link>}
        </div>
      </div>
      <div className="flex items-center">
        <SignOutButton name={session.user.name ?? null} />
      </div>
    </nav>
  )
}
