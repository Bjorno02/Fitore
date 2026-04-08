import { describe, it, expect, vi, beforeEach } from "vitest"
import { Role } from "@/generated/prisma/enums"

vi.mock("@/lib/prisma", () => ({
  default: { membership: { findUnique: vi.fn() } },
}))

import prisma from "@/lib/prisma"
import { requireGymMember } from "./auth-guards"

const mockFindUnique = prisma.membership.findUnique as ReturnType<typeof vi.fn>

describe("requireGymMember", () => {
  beforeEach(() => vi.resetAllMocks())

  it("returns 401 when userId is undefined", async () => {
    const result = await requireGymMember(undefined, "gym-1")
    expect(result).toEqual({ ok: false, status: 401 })
  })

  it("returns 403 when membership not found", async () => {
    mockFindUnique.mockResolvedValue(null)
    const result = await requireGymMember("user-1", "gym-1")
    expect(result).toEqual({ ok: false, status: 403 })
  })

  it("returns 403 when membership status is PENDING", async () => {
    mockFindUnique.mockResolvedValue({ status: "PENDING", role: "ATHLETE" })
    const result = await requireGymMember("user-1", "gym-1")
    expect(result).toEqual({ ok: false, status: 403 })
  })

  it("returns ok for ACTIVE member with no role required", async () => {
    mockFindUnique.mockResolvedValue({ status: "ACTIVE", role: "ATHLETE" })
    const result = await requireGymMember("user-1", "gym-1")
    expect(result).toEqual({ ok: true, role: "ATHLETE" })
  })

  it("returns 403 when role is below required", async () => {
    mockFindUnique.mockResolvedValue({ status: "ACTIVE", role: "ATHLETE" })
    const result = await requireGymMember("user-1", "gym-1", Role.ADMIN)
    expect(result).toEqual({ ok: false, status: 403 })
  })

  it("returns ok when role meets required", async () => {
    mockFindUnique.mockResolvedValue({ status: "ACTIVE", role: "ADMIN" })
    const result = await requireGymMember("user-1", "gym-1", Role.COACH)
    expect(result).toEqual({ ok: true, role: "ADMIN" })
  })

  it("returns 403 for gym the user has no membership at", async () => {
    mockFindUnique.mockResolvedValue(null)
    const result = await requireGymMember("user-1", "gym-1")
    expect(result).toEqual({ ok: false, status: 403})
  })
})
