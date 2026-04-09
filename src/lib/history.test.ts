import { describe, it, expect } from "vitest"
import { buildActivityDays } from "./history"

const makeSession = (dateStr: string, overrides: Record<string, unknown> = {}) => ({
  duration: 60,
  intensity: 7,
  type: "sparring",
  createdAt: new Date(dateStr + "T10:00:00Z"),
  ...overrides,
})

const makeCheckIn = (dateStr: string, overrides: Record<string, unknown> = {}) => ({
  sleep: 8,
  soreness: 3,
  stress: 2,
  injury: false,
  createdAt: new Date(dateStr + "T08:00:00Z"),
  ...overrides,
})

describe("buildActivityDays", () => {
  it("returns empty array for no data", () => {
    expect(buildActivityDays([], [])).toEqual([])
  })

  it("creates an entry for a session with no check-in", () => {
    const result = buildActivityDays([makeSession("2024-06-04")], [])
    expect(result).toHaveLength(1)
    const [dateStr, entry] = result[0]
    expect(dateStr).toBe("2024-06-04")
    expect(entry.session).toEqual({ duration: 60, intensity: 7, type: "sparring" })
    expect(entry.checkIn).toBeUndefined()
  })

  it("creates an entry for a check-in with no session", () => {
    const result = buildActivityDays([], [makeCheckIn("2024-06-04")])
    expect(result).toHaveLength(1)
    const [dateStr, entry] = result[0]
    expect(dateStr).toBe("2024-06-04")
    expect(entry.checkIn).toEqual({ sleep: 8, soreness: 3, stress: 2, injury: false })
    expect(entry.session).toBeUndefined()
  })

  it("merges session and check-in from the same day into one entry", () => {
    const result = buildActivityDays(
      [makeSession("2024-06-04")],
      [makeCheckIn("2024-06-04")]
    )
    expect(result).toHaveLength(1)
    const [dateStr, entry] = result[0]
    expect(dateStr).toBe("2024-06-04")
    expect(entry.session).toEqual({ duration: 60, intensity: 7, type: "sparring" })
    expect(entry.checkIn).toEqual({ sleep: 8, soreness: 3, stress: 2, injury: false })
  })

  it("keeps session and check-in on different days as separate entries", () => {
    const result = buildActivityDays(
      [makeSession("2024-06-04")],
      [makeCheckIn("2024-06-03")]
    )
    expect(result).toHaveLength(2)
  })

  it("returns entries sorted newest-first", () => {
    const result = buildActivityDays(
      [makeSession("2024-06-03"), makeSession("2024-06-05")],
      []
    )
    expect(result[0][0]).toBe("2024-06-05")
    expect(result[1][0]).toBe("2024-06-03")
  })

  it("last session wins when two sessions share the same date", () => {
    const result = buildActivityDays(
      [
        makeSession("2024-06-04", { duration: 90, intensity: 9, type: "sparring" }),
        makeSession("2024-06-04", { duration: 45, intensity: 6, type: "drilling" }),
      ],
      []
    )
    expect(result).toHaveLength(1)
    // second entry processed wins (last-write-wins)
    const [, entry] = result[0]
    expect(entry.session?.type).toBe("drilling")
  })
})
