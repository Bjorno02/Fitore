import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function Home() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { gym: true },
  })

  if (!membership) redirect("/onboarding")

  if (membership.status === "PENDING") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="wordmark text-4xl text-blue-900 tracking-widest frost-enter">MartialOps</p>
        <div className="w-16 h-px" style={{ background: "linear-gradient(90deg, transparent, #2563eb, transparent)" }} />
        <div className="frost-card rounded-xl px-8 py-6 text-center frost-enter-2" style={{ maxWidth: 360 }}>
          <p className="font-semibold text-text-primary">{membership.gym.name}</p>
          <p className="text-text-secondary text-sm mt-1">Your request to join is pending.</p>
          <p className="text-text-muted text-xs mt-1">The coach will review it soon.</p>
        </div>
      </main>
    )
  }

  const isCoach = membership.role === "COACH" || membership.role === "ADMIN"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="text-center frost-enter">
        <p className="frost-label mb-2">Welcome back</p>
        <h1 className="wordmark text-5xl text-blue-900 tracking-widest">{membership.gym.name}</h1>
        <p className="text-text-secondary mt-2">{session.user.name}</p>
      </div>
      <div className="w-20 h-px frost-enter" style={{ background: "linear-gradient(90deg, transparent, #2563eb, transparent)" }} />
      <div className="flex gap-3 frost-enter-2">
        <Link href="/athlete" className="btn-frost-primary">Log Training</Link>
        {isCoach && (
          <Link href="/dashboard" className="btn-frost-ghost">Coach Dashboard</Link>
        )}
      </div>
    </main>
  )
}
