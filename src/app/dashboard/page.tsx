import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { calcLoad, calcReadiness } from "@/lib/scoring"
import PendingRequests from "./PendingRequests"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, role: { in: ["COACH", "ADMIN"] }, status: "ACTIVE" },
    include: { gym: true },
  })

  if (!membership) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-text-muted">You are not a coach at any gym.</p>
      </main>
    )
  }

  const pendingRequests = membership.role === "ADMIN"
    ? await prisma.membership.findMany({
        where: { gymId: membership.gymId, status: "PENDING" },
        include: { user: { select: { id: true, name: true, email: true } } },
      })
    : []

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
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 frost-enter">
        <p className="frost-label mb-1">Coach Dashboard</p>
        <h1 className="wordmark text-3xl text-blue-900 tracking-wide">{membership.gym.name}</h1>
      </div>

      <div className="frost-enter-2">
        <PendingRequests requests={pendingRequests} />
      </div>

      {/* Training Sessions */}
      <section className="mb-6 frost-enter-3">
        <p className="frost-label mb-3">Training Sessions</p>
        <div className="frost-card rounded-xl overflow-hidden">
          {sessions.length === 0 ? (
            <p className="text-text-muted text-sm px-5 py-4">No sessions logged yet.</p>
          ) : sessions.map((s, i) => (
            <div key={s.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== sessions.length - 1 ? "frost-row" : ""}`}>
              <span className="font-semibold text-text-primary text-sm w-32 truncate">{s.user.name ?? s.user.email}</span>
              <span className="text-text-secondary text-xs">{s.type} · {s.duration}min · ×{s.intensity}</span>
              <span className="badge-load text-xs px-3 py-1 rounded-lg">
                Load {calcLoad(s.duration, s.intensity, s.type).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Check-ins */}
      <section className="frost-enter-4">
        <p className="frost-label mb-3">Check-ins</p>
        <div className="frost-card rounded-xl overflow-hidden">
          {checkins.length === 0 ? (
            <p className="text-text-muted text-sm px-5 py-4">No check-ins yet.</p>
          ) : checkins.map((c, i) => (
            <div key={c.id} className={`flex items-center justify-between px-5 py-3.5 ${i !== checkins.length - 1 ? "frost-row" : ""}`}>
              <span className="font-semibold text-text-primary text-sm w-32 truncate">{c.user.name ?? c.user.email}</span>
              <span className="text-text-secondary text-xs">
                sleep {c.sleep} · soreness {c.soreness} · stress {c.stress}{c.injury ? " · inj." : ""}
              </span>
              <span className="badge-load text-xs px-3 py-1 rounded-lg">
                Readiness {calcReadiness(c.sleep, c.soreness, c.stress, c.injury).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
