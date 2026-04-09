// src/app/api/dashboard/summary/route.ts
import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { Role } from "@/generated/prisma/enums"
import { requireGymMember } from "@/lib/auth-guards"
import prisma from "@/lib/prisma"

const summarySchema = z.object({
  gymId: z.string().min(1),
  month: z.string().regex(/^\d{4}-\d{2}$/),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const params = Object.fromEntries(req.nextUrl.searchParams)
  const result = summarySchema.safeParse(params)
  if (!result.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const { gymId, month } = result.data
  const guard = await requireGymMember(session.user.id, gymId, Role.COACH)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const [year, mon] = month.split("-").map(Number)
  const start = new Date(Date.UTC(year, mon - 1, 1))
  const end = new Date(Date.UTC(year, mon, 1))

  const checkIns = await prisma.checkIn.findMany({
    where: { gymId, createdAt: { gte: start, lt: end } },
    select: { createdAt: true },
  })

  const counts: Record<string, number> = {}
  for (const c of checkIns) {
    const date = c.createdAt.toISOString().split("T")[0]
    counts[date] = (counts[date] ?? 0) + 1
  }

  return Response.json(counts)
}
