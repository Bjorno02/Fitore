import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { calcLoad, calcReadiness } from "@/lib/scoring"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      role: { in: ["COACH", "ADMIN"] },
    },
    include: { gym: true },
  })

  if (!membership) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">You are not a coach at any gym.</p>
      </main>
    )
  }

  const [sessions, checkins] = await Promise.all([
    prisma.trainingSession.findMany({
      where: { gymId: membership.gymId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.checkIn.findMany({
      where: { gymId: membership.gymId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold">{membership.gym.name} — Coach Dashboard</h1>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-medium">Training Sessions</h2>
        <div className="flex flex-col gap-3">
          {sessions.map(s => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="font-medium">{s.user.name ?? s.user.email}</span>
              <span className="text-sm text-zinc-500">{s.type} · {s.duration}min · intensity {s.intensity}</span>
              <span className="font-mono text-sm">Load: {calcLoad(s.duration, s.intensity, s.type).toFixed(0)}</span>
            </div>
          ))}
          {sessions.length === 0 && <p className="text-zinc-400">No sessions logged yet.</p>}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">Check-ins</h2>
        <div className="flex flex-col gap-3">
          {checkins.map(c => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="font-medium">{c.user.name ?? c.user.email}</span>
              <span className="text-sm text-zinc-500">sleep {c.sleep} · soreness {c.soreness} · stress {c.stress}{c.injury ? " · injured" : ""}</span>
              <span className="font-mono text-sm">Readiness: {calcReadiness(c.sleep, c.soreness, c.stress, c.injury).toFixed(0)}</span>
            </div>
          ))}
          {checkins.length === 0 && <p className="text-zinc-400">No check-ins yet.</p>}
        </div>
      </section>
    </main>
  )
}
