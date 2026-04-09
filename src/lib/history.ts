export type ActivityDay = {
  session?: { duration: number; intensity: number; type: string }
  checkIn?: { sleep: number; soreness: number; stress: number; injury: boolean }
}

type SessionInput = { duration: number; intensity: number; type: string; createdAt: Date }
type CheckInInput = { sleep: number; soreness: number; stress: number; injury: boolean; createdAt: Date }

export function buildActivityDays(
  sessions: SessionInput[],
  checkIns: CheckInInput[]
): [string, ActivityDay][] {
  const map: Record<string, ActivityDay> = {}

  for (const s of sessions) {
    const key = s.createdAt.toISOString().split("T")[0]
    map[key] = { ...map[key], session: { duration: s.duration, intensity: s.intensity, type: s.type } }
  }

  for (const c of checkIns) {
    const key = c.createdAt.toISOString().split("T")[0]
    map[key] = { ...map[key], checkIn: { sleep: c.sleep, soreness: c.soreness, stress: c.stress, injury: c.injury } }
  }

  return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
}
