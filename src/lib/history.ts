export type ActivityDay = {
  session?: { duration: number; intensity: number; type: string }
  checkIn?: { sleep: number; soreness: number; stress: number; injury: boolean }
}

type SessionInput = { duration: number; intensity: number; type: string; createdAt: Date }
type CheckInInput = { sleep: number; soreness: number; stress: number; injury: boolean; createdAt: Date }

/**
 * Merges sessions and check-ins into a day-keyed list sorted newest-first.
 * Assumes at most one session and one check-in per calendar day (current data constraints).
 * If multiple sessions share a date, the last one processed wins.
 * Date keys are UTC — a session logged just after midnight local time may bucket to the previous UTC day.
 */
export function buildActivityDays(
  sessions: SessionInput[],
  checkIns: CheckInInput[]
): [string, ActivityDay][] {
  const map: Record<string, ActivityDay> = {}

  for (const s of sessions) {
    const key = s.createdAt.toISOString().split("T")[0] // UTC date
    map[key] = { ...map[key], session: { duration: s.duration, intensity: s.intensity, type: s.type } }
  }

  for (const c of checkIns) {
    const key = c.createdAt.toISOString().split("T")[0] // UTC date
    map[key] = { ...map[key], checkIn: { sleep: c.sleep, soreness: c.soreness, stress: c.stress, injury: c.injury } }
  }

  return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
}
