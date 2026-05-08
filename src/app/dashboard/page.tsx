import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import PageHeader from "@/components/PageHeader"
import CalendarPanel from "./CalendarPanel"
import InviteCodesPanel from "./InviteCodesPanel"
import MembersPanel from "./MembersPanel"
import { getActiveGymContext } from "@/lib/active-gym"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const ctx = await getActiveGymContext(session.user.id)
  const membership =
    ctx && (ctx.active.role === "COACH" || ctx.active.role === "ADMIN")
      ? ctx.active
      : null

  if (!membership) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-24 md:px-12">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
            color: "var(--color-ink-muted)",
          }}
        >
          — You are not a coach at this gym —
        </p>
      </main>
    )
  }

  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

  const monthCheckIns = await prisma.checkIn.findMany({
    where: {
      gymId: membership.gymId,
      createdAt: { gte: monthStart, lt: monthEnd },
    },
    select: { createdAt: true },
  })

  const monthSummary: Record<string, number> = {}
  for (const c of monthCheckIns) {
    const date = c.createdAt.toISOString().split("T")[0]
    monthSummary[date] = (monthSummary[date] ?? 0) + 1
  }

  const todayStr = now.toISOString().split("T")[0]

  const [sessionCount, checkinCount] = await Promise.all([
    prisma.trainingSession.count({ where: { gymId: membership.gymId } }),
    prisma.checkIn.count({ where: { gymId: membership.gymId } }),
  ])

  return (
    <main>
      <PageHeader label="Coach Dashboard" title={membership.gym.name} />
      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-12">
        {/* Stat strip + settings shortcut */}
        <section className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto]">
          <div
            className="border-t pt-6"
            style={{ borderColor: "var(--color-rule-strong)" }}
          >
            <div
              className="mb-6"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
              }}
            >
              <span style={{ color: "var(--color-accent)" }}>§ 01</span> Gym Overview
            </div>
            <div className="grid grid-cols-2 gap-8">
              {[
                { value: sessionCount, label: "Sessions" },
                { value: checkinCount, label: "Check-ins" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span
                    style={{
                      fontFamily: "var(--font-barlow)",
                      fontWeight: 800,
                      fontSize: "var(--text-display-md)",
                      lineHeight: 1,
                      letterSpacing: "var(--tracking-display)",
                      color: "var(--color-ink)",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="mt-3"
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-eyebrow)",
                      letterSpacing: "var(--tracking-label)",
                      textTransform: "uppercase",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/settings"
            className="group flex flex-col items-start justify-between border px-6 py-6 no-underline transition-all hover:-translate-y-0.5"
            style={{
              borderColor: "var(--color-ink)",
              color: "var(--color-ink)",
              minWidth: "200px",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-eyebrow)",
                letterSpacing: "var(--tracking-eyebrow)",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
              }}
            >
              <span style={{ color: "var(--color-accent)" }}>§ 02</span> Configure
            </div>
            <div className="mt-4 flex items-end justify-between w-full">
              <span
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 800,
                  fontSize: "var(--text-display-sm)",
                  lineHeight: 1,
                  letterSpacing: "var(--tracking-display)",
                  textTransform: "uppercase",
                }}
              >
                Weights
              </span>
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
                style={{
                  color: "var(--color-accent)",
                  fontSize: "20px",
                }}
              >
                →
              </span>
            </div>
          </Link>
        </section>

        <InviteCodesPanel gymId={membership.gymId} />

        <MembersPanel
          gymId={membership.gymId}
          currentUserId={session.user.id}
          currentUserRole={membership.role}
        />

        <CalendarPanel
          gymId={membership.gymId}
          initialMonthSummary={monthSummary}
          initialDate={todayStr}
        />
      </div>
    </main>
  )
}
