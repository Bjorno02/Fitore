import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import HomeHero from "./HomeHero"
import HomeCards from "./HomeCards"

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
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <p className="wordmark-frost text-4xl tracking-widest frost-enter">MartialOps</p>
        <div className="w-16 h-px frost-enter"
          style={{ background: "linear-gradient(90deg, transparent, #84cc16, transparent)" }} />
        <div className="frost-card rounded-2xl px-10 py-8 text-center frost-enter-2" style={{ maxWidth: 380 }}>
          <p className="font-semibold text-lg mb-1">{membership.gym.name}</p>
          <p className="text-text-secondary text-sm mt-1">Your request to join is pending approval.</p>
          <p className="text-text-muted text-xs mt-2">The coach will review it soon.</p>
        </div>
      </main>
    )
  }

  const isCoach = membership.role === "COACH" || membership.role === "ADMIN"

  return (
    <main className="flex-1 flex flex-col lg:flex-row frost-enter" style={{ minHeight: 0 }}>
      <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
        <HomeHero gymName={membership.gym.name} userName={session.user.name} />
      </div>
      <div className="hidden lg:block metallic-strip" />
      <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
        <HomeCards isCoach={isCoach} />
      </div>
    </main>
  )
}
