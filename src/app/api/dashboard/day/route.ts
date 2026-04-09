// src/app/api/dashboard/day/route.ts
import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { Role } from "@/generated/prisma/enums"
import { requireGymMember } from "@/lib/auth-guards"
import prisma from "@/lib/prisma"
import { calcLoad, calcReadiness } from "@/lib/scoring"

const daySchema = z.object({
  gymId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const params = Object.fromEntries(req.nextUrl.searchParams)
  const result = daySchema.safeParse(params)
  if (!result.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const { gymId, date } = result.data
  const guard = await requireGymMember(session.user.id, gymId, Role.COACH)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const start = new Date(`${date}T00:00:00.000Z`)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + 1)

  const [checkIns, sessions] = await Promise.all([
    prisma.checkIn.findMany({
      where: { gymId, createdAt: { gte: start, lt: end } },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    prisma.trainingSession.findMany({
      where: { gymId, createdAt: { gte: start, lt: end } },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ])

  const athletes = new Map<string, {
    name: string | null
    checkIn?: { sleep: number; soreness: number; stress: number; injury: boolean; readiness: number }
    session?: { type: string; duration: number; intensity: number; load: number }
  }>()

  for (const c of checkIns) {
    athletes.set(c.userId, {
      name: c.user.name ?? c.user.email,
      checkIn: {
        sleep: c.sleep,
        soreness: c.soreness,
        stress: c.stress,
        injury: c.injury,
        readiness: Math.round(calcReadiness(c.sleep, c.soreness, c.stress, c.injury)),
      },
    })
  }

  for (const s of sessions) {
    const existing = athletes.get(s.userId) ?? { name: s.user.name ?? s.user.email }
    athletes.set(s.userId, {
      ...existing,
      session: {
        type: s.type,
        duration: s.duration,
        intensity: s.intensity,
        load: Math.round(calcLoad(s.duration, s.intensity, s.type)),
      },
    })
  }

  const data = Array.from(athletes.entries())
    .map(([userId, d]) => ({ userId, ...d }))
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))

  return Response.json(data)
}
