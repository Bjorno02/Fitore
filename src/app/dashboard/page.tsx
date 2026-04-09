import { redirect } from "next/navigation"
import Link from "next/link"
import { LuSettings } from "react-icons/lu"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import PendingRequests from "./PendingRequests"
import PageHeader from "@/components/PageHeader"
import CalendarPanel from "./CalendarPanel"

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

  // Month summary for calendar — group check-in counts by date (UTC)
  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

  const monthCheckIns = await prisma.checkIn.findMany({
    where: { gymId: membership.gymId, createdAt: { gte: monthStart, lt: monthEnd } },
    select: { createdAt: true },
  })

  const monthSummary: Record<string, number> = {}
  for (const c of monthCheckIns) {
    const date = c.createdAt.toISOString().split("T")[0]
    monthSummary[date] = (monthSummary[date] ?? 0) + 1
  }

  const todayStr = now.toISOString().split("T")[0]

  // Counts for the stat strip
  const [sessionCount, checkinCount] = await Promise.all([
    prisma.trainingSession.count({ where: { gymId: membership.gymId } }),
    prisma.checkIn.count({ where: { gymId: membership.gymId } }),
  ])

  return (
    <main className="flex-1 flex flex-col">
      <PageHeader label="Coach Dashboard" title={membership.gym.name} />
      <div className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row gap-4 items-stretch mb-10 frost-enter-2">
            <div
              className="flex-1 frost-card rounded-2xl overflow-hidden"
              style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
            >
              <div className="frost-card-header px-6 py-2.5">
                <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>Gym Overview</p>
              </div>
              <div className="flex">
                <div className="frost-stat">
                  <span className="frost-stat-value" style={{ color: "#84cc16" }}>{sessionCount}</span>
                  <span className="frost-stat-label">Sessions</span>
                </div>
                <div className="frost-stat">
                  <span className="frost-stat-value" style={{ color: "#84cc16" }}>{checkinCount}</span>
                  <span className="frost-stat-label">Check-ins</span>
                </div>
                <div className="frost-stat">
                  <span className="frost-stat-value" style={{ color: "#84cc16" }}>{pendingRequests.length}</span>
                  <span className="frost-stat-label">Pending</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard/settings"
              className="frost-card rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3 px-8 py-4 min-w-40 no-underline"
              style={{
                borderTop: "1px solid rgba(132,204,22,0.22)",
              }}
            >
              <LuSettings
                size={28}
                aria-hidden="true"
                style={{
                  color: "#84cc16",
                  filter: "drop-shadow(0 0 6px rgba(132,204,22,0.5))",
                }}
              />
              <span
                className="text-xs font-bold tracking-widest uppercase text-center"
                style={{ color: "rgba(132,204,22,0.78)" }}
              >
                Configure<br />Weights
              </span>
            </Link>
          </div>

          {/* Pending requests */}
          {pendingRequests.length > 0 && (
            <div className="mb-8 frost-enter-2">
              <PendingRequests requests={pendingRequests} />
            </div>
          )}

          {/* Calendar + day panel */}
          <CalendarPanel
            gymId={membership.gymId}
            initialMonthSummary={monthSummary}
            initialDate={todayStr}
          />

        </div>
      </div>
    </main>
  )
}
