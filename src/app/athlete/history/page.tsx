import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import PageHeader from "@/components/PageHeader"
import { calcLoad, calcReadiness, gymSettingsToConfig } from "@/lib/scoring"
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
    return (
      <main className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
            color: "var(--color-ink-muted)",
          }}
        >
          — You are not a member of any gym —
        </p>
      </main>
    )
  }

  const userId = session.user.id
  const gymId = membership.gymId

  const [sessions, checkIns, gymSettingsRow] = await Promise.all([
    prisma.trainingSession.findMany({
      where: { userId, gymId },
      orderBy: { createdAt: "desc" },
      select: { duration: true, intensity: true, type: true, createdAt: true },
    }),
    prisma.checkIn.findMany({
      where: { userId, gymId },
      orderBy: { createdAt: "desc" },
      select: {
        sleep: true,
        soreness: true,
        stress: true,
        injury: true,
        createdAt: true,
      },
    }),
    prisma.gymSettings.findUnique({ where: { gymId } }),
  ])

  const { loadConfig, readinessConfig } = gymSettingsToConfig(gymSettingsRow)

  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0)
  const avgSleep = checkIns.length
    ? Math.round((checkIns.reduce((acc, c) => acc + c.sleep, 0) / checkIns.length) * 10) / 10
    : 0
  const avgReadiness = checkIns.length
    ? Math.round(
        checkIns.reduce(
          (acc, c) =>
            acc +
            calcReadiness(c.sleep, c.soreness, c.stress, c.injury, readinessConfig),
          0,
        ) / checkIns.length,
      )
    : 0

  const days = buildActivityDays(sessions, checkIns)

  const typeCounts: Record<string, number> = {}
  for (const s of sessions) {
    typeCounts[s.type] = (typeCounts[s.type] ?? 0) + 1
  }
  const maxTypeCount = Math.max(...SESSION_TYPES.map((t) => typeCounts[t] ?? 0), 1)

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const loadByDay = days
    .filter(
      ([dateStr, entry]) =>
        new Date(dateStr + "T12:00:00Z") >= thirtyDaysAgo && entry.sessions.length > 0,
    )
    .map(([dateStr, entry]) => ({
      date: dateStr,
      load: entry.sessions.reduce(
        (sum, s) => sum + calcLoad(s.duration, s.intensity, s.type, loadConfig),
        0,
      ),
    }))
    .reverse()
  const maxLoad = Math.max(...loadByDay.map((d) => d.load), 1)

  return (
    <main>
      <PageHeader
        label={membership.gym.name}
        title="History"
        meta={session.user.name ?? undefined}
      />
      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-12">
        {/* Back link */}
        <div className="mb-12">
          <Link
            href="/athlete"
            className="group inline-flex items-center gap-3 transition-opacity hover:opacity-100"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              opacity: 0.7,
            }}
          >
            <span
              style={{ color: "var(--color-accent)" }}
              className="transition-transform group-hover:-translate-x-1"
            >
              ←
            </span>
            <span>Log Training</span>
          </Link>
        </div>

        {/* § 01 Lifetime stats */}
        <section
          className="mb-16 border-t pt-6"
          style={{ borderColor: "var(--color-rule-strong)" }}
        >
          <div
            className="mb-8"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
            }}
          >
            <span style={{ color: "var(--color-accent)" }}>§ 01</span> Lifetime Stats
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: totalSessions, label: "Sessions" },
              { value: totalMinutes, label: "Minutes" },
              { value: avgSleep, label: "Avg Sleep" },
              { value: avgReadiness, label: "Avg Readiness" },
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
        </section>

        {/* § 02 Charts */}
        <section
          className="mb-16 grid grid-cols-1 gap-12 border-t pt-6 lg:grid-cols-2 lg:gap-16"
          style={{ borderColor: "var(--color-rule-strong)" }}
        >
          {/* Session breakdown */}
          <div>
            <div
              className="mb-6 flex items-baseline justify-between border-b pb-3"
              style={{ borderColor: "var(--color-rule)" }}
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
                <span style={{ color: "var(--color-accent)" }}>§ 02a</span> Session Breakdown
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-faint)",
                }}
              >
                By Type
              </span>
            </div>
            {totalSessions === 0 ? (
              <p
                className="py-12 text-center"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                }}
              >
                — No sessions yet —
              </p>
            ) : (
              <div
                className="flex items-end gap-4 border-b pb-2"
                style={{ height: 140, borderColor: "var(--color-rule-strong)" }}
              >
                {SESSION_TYPES.map((type) => {
                  const count = typeCounts[type] ?? 0
                  const heightPct = Math.round((count / maxTypeCount) * 100)
                  return (
                    <div
                      key={type}
                      className="flex flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-barlow)",
                          fontWeight: 800,
                          fontSize: "22px",
                          color: "var(--color-ink)",
                          lineHeight: 1,
                        }}
                      >
                        {count}
                      </span>
                      <div
                        className="w-full"
                        style={{
                          height: `${heightPct}%`,
                          minHeight: count > 0 ? 6 : 0,
                          backgroundColor: "var(--color-accent)",
                        }}
                      />
                      <span
                        className="mt-1"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--color-ink-muted)",
                        }}
                      >
                        {type.slice(0, 4)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Load last 30 days */}
          <div>
            <div
              className="mb-6 flex items-baseline justify-between border-b pb-3"
              style={{ borderColor: "var(--color-rule)" }}
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
                <span style={{ color: "var(--color-accent)" }}>§ 02b</span> Load · Last 30 Days
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-faint)",
                }}
              >
                Daily
              </span>
            </div>
            {loadByDay.length === 0 ? (
              <p
                className="py-12 text-center"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                }}
              >
                — No sessions in last 30 days —
              </p>
            ) : (
              <div
                className="flex items-end gap-1 border-b pb-2"
                style={{ height: 140, borderColor: "var(--color-rule-strong)" }}
              >
                {loadByDay.map(({ date, load }) => (
                  <div
                    key={date}
                    className="flex-1"
                    title={`${date}: load ${Math.round(load)}`}
                    style={{
                      height: `${Math.round((load / maxLoad) * 100)}%`,
                      minHeight: 4,
                      backgroundColor: "var(--color-ink)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* § 03 Activity log */}
        <section
          className="border-t pt-6"
          style={{ borderColor: "var(--color-rule-strong)" }}
        >
          <div
            className="mb-8 flex items-baseline justify-between border-b pb-3"
            style={{ borderColor: "var(--color-rule)" }}
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
              <span style={{ color: "var(--color-accent)" }}>§ 03</span> Activity Log
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-ink-faint)",
              }}
            >
              Newest First
            </span>
          </div>

          {days.length === 0 ? (
            <p
              className="py-12 text-center"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                letterSpacing: "var(--tracking-label)",
                textTransform: "uppercase",
                color: "var(--color-ink-muted)",
              }}
            >
              — No activity logged yet —
            </p>
          ) : (
            <div>
              {days.flatMap(([dateStr, entry]) => {
                const display = new Date(dateStr + "T12:00:00Z").toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" },
                )
                const checkInDetail = entry.checkIn
                  ? `Sleep ${entry.checkIn.sleep} · Sore ${entry.checkIn.soreness}${entry.checkIn.injury ? " · Injury" : ""}`
                  : null

                if (entry.sessions.length === 0) {
                  return [
                    <div
                      key={dateStr}
                      className="border-b py-4"
                      style={{ borderColor: "var(--color-rule)" }}
                    >
                      <div className="mb-1 flex items-baseline justify-between gap-4">
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontWeight: 600,
                            fontSize: "16px",
                            color: "var(--color-ink)",
                          }}
                        >
                          {display}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "var(--color-ink-faint)",
                          }}
                        >
                          Check-in only
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "11px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "var(--color-ink-muted)",
                        }}
                      >
                        {checkInDetail}
                      </p>
                    </div>,
                  ]
                }

                return entry.sessions.map((sess, i) => (
                  <div
                    key={`${dateStr}-${i}`}
                    className="border-b py-4"
                    style={{ borderColor: "var(--color-rule)" }}
                  >
                    <div className="mb-1 flex items-baseline justify-between gap-4">
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "var(--color-ink)",
                        }}
                      >
                        {display}
                      </span>
                      <span
                        className="flex items-baseline gap-1.5 border px-2.5 py-1"
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "var(--color-accent)",
                          borderColor: "var(--color-accent)",
                          backgroundColor: "var(--color-accent-soft)",
                        }}
                      >
                        {sess.type}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      {sess.duration}min · ×{sess.intensity}
                      {i === 0 && checkInDetail ? ` · ${checkInDetail}` : ""}
                      {i === 0 && !checkInDetail ? " · No check-in" : ""}
                    </p>
                  </div>
                ))
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
