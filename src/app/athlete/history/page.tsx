import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import PageHeader from "@/components/PageHeader"
import { calcLoad, calcReadiness } from "@/lib/scoring"
import { buildActivityDays } from "@/lib/history"

const SESSION_TYPES = ["sparring", "drilling", "conditioning", "weights"] as const

export default async function AthleteHistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: { gym: true },
  })
  if (!membership) {
    return <p className="text-text-muted p-6">You are not a member of any gym.</p>
  }

  const userId = session.user.id
  const gymId = membership.gymId

  const [sessions, checkIns] = await Promise.all([
    prisma.trainingSession.findMany({
      where: { userId, gymId },
      orderBy: { createdAt: "desc" },
      select: { duration: true, intensity: true, type: true, createdAt: true },
    }),
    prisma.checkIn.findMany({
      where: { userId, gymId },
      orderBy: { createdAt: "desc" },
      select: { sleep: true, soreness: true, stress: true, injury: true, createdAt: true },
    }),
  ])

  // Lifetime stats
  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0)
  const avgSleep = checkIns.length
    ? Math.round((checkIns.reduce((acc, c) => acc + c.sleep, 0) / checkIns.length) * 10) / 10
    : 0
  const avgReadiness = checkIns.length
    ? Math.round(
        checkIns.reduce((acc, c) => acc + calcReadiness(c.sleep, c.soreness, c.stress, c.injury), 0)
        / checkIns.length
      )
    : 0

  // Day map (newest-first)
  const days = buildActivityDays(sessions, checkIns)

  // Session type breakdown
  const typeCounts: Record<string, number> = {}
  for (const s of sessions) {
    typeCounts[s.type] = (typeCounts[s.type] ?? 0) + 1
  }
  const maxTypeCount = Math.max(...SESSION_TYPES.map(t => typeCounts[t] ?? 0), 1)

  // Load last 30 days (oldest → newest for left-to-right chart)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const loadByDay = days
    .filter(([dateStr, entry]) => new Date(dateStr + "T12:00:00Z") >= thirtyDaysAgo && entry.sessions.length > 0)
    .map(([dateStr, entry]) => ({
      date: dateStr,
      load: entry.sessions.reduce((sum, s) => sum + calcLoad(s.duration, s.intensity, s.type), 0),
    }))
    .reverse()
  const maxLoad = Math.max(...loadByDay.map(d => d.load), 1)

  return (
    <main className="flex-1 flex flex-col">
      <PageHeader
        label={membership.gym.name}
        title="History"
        meta={session.user.name ?? undefined}
      />
      <div className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">

          {/* Back link */}
          <div className="mb-8 frost-enter">
            <Link
              href="/athlete"
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(132,204,22,0.78)" }}
            >
              ← Log Training
            </Link>
          </div>

          {/* Stat strip */}
          <div
            className="frost-card rounded-2xl overflow-hidden mb-8 frost-enter-2"
            style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
          >
            <div className="frost-card-header px-6 py-2.5">
              <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>Lifetime Stats</p>
            </div>
            <div className="flex">
              <div className="frost-stat">
                <span className="frost-stat-value" style={{ color: "#84cc16" }}>{totalSessions}</span>
                <span className="frost-stat-label">Sessions</span>
              </div>
              <div className="frost-stat">
                <span className="frost-stat-value" style={{ color: "#84cc16" }}>{totalMinutes}</span>
                <span className="frost-stat-label">Minutes</span>
              </div>
              <div className="frost-stat">
                <span className="frost-stat-value" style={{ color: "#84cc16" }}>{avgSleep}</span>
                <span className="frost-stat-label">Avg Sleep</span>
              </div>
              <div className="frost-stat">
                <span className="frost-stat-value" style={{ color: "#84cc16" }}>{avgReadiness}</span>
                <span className="frost-stat-label">Avg Readiness</span>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 frost-enter-2">

            {/* Session type breakdown */}
            <div
              className="frost-card rounded-2xl overflow-hidden"
              style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
            >
              <div className="frost-card-header px-5 py-3">
                <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>Session Breakdown</p>
              </div>
              <div className="px-5 py-4">
                {totalSessions === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: "rgba(148,163,184,0.6)" }}>
                    No sessions logged yet.
                  </p>
                ) : (
                  <div className="flex items-end gap-3 h-24">
                    {SESSION_TYPES.map(type => {
                      const count = typeCounts[type] ?? 0
                      const heightPct = Math.round((count / maxTypeCount) * 100)
                      return (
                        <div key={type} className="flex-1 flex flex-col items-center gap-1.5">
                          <span className="text-xs font-semibold" style={{ color: "#84cc16" }}>{count}</span>
                          <div
                            className="w-full rounded-t-sm transition-all"
                            style={{
                              height: `${heightPct}%`,
                              minHeight: count > 0 ? 4 : 0,
                              background: "linear-gradient(180deg, rgba(132,204,22,0.7) 0%, rgba(101,163,13,0.5) 100%)",
                            }}
                          />
                          <span className="text-xs capitalize" style={{ color: "rgba(148,163,184,0.65)" }}>
                            {type.slice(0, 4)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Load last 30 days */}
            <div
              className="frost-card rounded-2xl overflow-hidden"
              style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
            >
              <div className="frost-card-header px-5 py-3">
                <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>Load — Last 30 Days</p>
              </div>
              <div className="px-5 py-4">
                {loadByDay.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ color: "rgba(148,163,184,0.6)" }}>
                    No sessions in the last 30 days.
                  </p>
                ) : (
                  <div className="flex items-end gap-1 h-24">
                    {loadByDay.map(({ date, load }) => (
                      <div
                        key={date}
                        className="flex-1 rounded-t-sm"
                        title={`${date}: load ${Math.round(load)}`}
                        style={{
                          height: `${Math.round((load / maxLoad) * 100)}%`,
                          minHeight: 4,
                          background: "linear-gradient(180deg, rgba(132,204,22,0.7) 0%, rgba(101,163,13,0.5) 100%)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Activity list */}
          <div
            className="frost-card rounded-2xl overflow-hidden frost-enter-3"
            style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
          >
            <div className="frost-card-header px-5 py-3">
              <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>Activity Log</p>
            </div>
            <div style={{ maxHeight: 600, overflowY: "auto" }}>
              {days.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "rgba(148,163,184,0.6)" }}>
                  No activity logged yet.
                </p>
              ) : (
                days.flatMap(([dateStr, entry]) => {
                  const display = new Date(dateStr + "T12:00:00Z").toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })
                  const checkInDetail = entry.checkIn
                    ? `sleep ${entry.checkIn.sleep} · sore ${entry.checkIn.soreness}${entry.checkIn.injury ? " · injury" : ""}`
                    : null

                  if (entry.sessions.length === 0) {
                    return [(
                      <div key={dateStr} className="px-5 py-3.5 frost-row">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-text-primary">{display}</span>
                        </div>
                        <p className="text-xs" style={{ color: "rgba(148,163,184,0.82)" }}>
                          check-in only · {checkInDetail}
                        </p>
                      </div>
                    )]
                  }

                  return entry.sessions.map((session, i) => (
                    <div key={`${dateStr}-${i}`} className="px-5 py-3.5 frost-row">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-text-primary">{display}</span>
                        <span
                          className="text-xs px-2.5 py-0.5 rounded-lg capitalize"
                          style={{ background: "rgba(34,197,94,0.12)", color: "#86efac" }}
                        >
                          {session.type}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "rgba(148,163,184,0.82)" }}>
                        {session.duration}min ×{session.intensity}
                        {i === 0 && checkInDetail ? ` · ${checkInDetail}` : ""}
                        {i === 0 && !checkInDetail ? " · no check-in" : ""}
                      </p>
                    </div>
                  ))
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
