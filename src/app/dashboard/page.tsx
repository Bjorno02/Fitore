import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { calcLoad, calcReadiness } from "@/lib/scoring"
import PendingRequests from "./PendingRequests"
import PageHeader from "@/components/PageHeader"

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
    <main className="flex-1 flex flex-col">
      <PageHeader
        label="Coach Dashboard"
        title={membership.gym.name}
      />
      <div className="flex-1 px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Stat strip */}
        <div className="frost-card rounded-xl overflow-hidden mb-10 frost-enter-2">
          <div className="flex">
            <div className="frost-stat">
              <span className="frost-stat-value">{sessions.length}</span>
              <span className="frost-stat-label">Sessions</span>
            </div>
            <div className="frost-stat">
              <span className="frost-stat-value">{checkins.length}</span>
              <span className="frost-stat-label">Check-ins</span>
            </div>
            <div className="frost-stat">
              <span className="frost-stat-value">{pendingRequests.length}</span>
              <span className="frost-stat-label">Pending</span>
            </div>
          </div>
        </div>

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <div className="mb-8 frost-enter-2">
            <PendingRequests requests={pendingRequests} />
          </div>
        )}

        {/* 2-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 frost-enter-3">

          {/* Training Sessions */}
          <section>
            <p className="frost-label mb-3">Training Sessions</p>
            <div className="frost-card rounded-xl overflow-hidden">
              {sessions.length === 0 ? (
                <p className="text-text-muted text-sm px-5 py-6 text-center">No sessions logged yet.</p>
              ) : sessions.map((s, i) => (
                <div key={s.id} className={`px-5 py-4 ${i !== sessions.length - 1 ? "frost-row" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm truncate max-w-[140px]">
                      {s.user.name ?? s.user.email}
                    </span>
                    <span className="badge-load text-xs px-2.5 py-1 rounded-lg shrink-0">
                      {calcLoad(s.duration, s.intensity, s.type).toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
                    {s.type} · {s.duration}min · ×{s.intensity}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Check-ins */}
          <section>
            <p className="frost-label mb-3">Check-ins</p>
            <div className="frost-card rounded-xl overflow-hidden">
              {checkins.length === 0 ? (
                <p className="text-text-muted text-sm px-5 py-6 text-center">No check-ins yet.</p>
              ) : checkins.map((c, i) => (
                <div key={c.id} className={`px-5 py-4 ${i !== checkins.length - 1 ? "frost-row" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm truncate max-w-[140px]">
                      {c.user.name ?? c.user.email}
                    </span>
                    <span className="badge-load text-xs px-2.5 py-1 rounded-lg shrink-0">
                      {calcReadiness(c.sleep, c.soreness, c.stress, c.injury).toFixed(0)}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "rgba(148,163,184,0.6)" }}>
                    sleep {c.sleep} · soreness {c.soreness} · stress {c.stress}
                    {c.injury ? " · injury" : ""}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      </div>
    </main>
  )
}
