import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { requireGymMember } from "@/lib/auth-guards"
import { Role } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { generateUniqueCode } from "@/lib/invite-codes"
import {
  writeLimit,
  searchLimit,
  checkLimit,
  rateLimitResponse,
} from "@/lib/rate-limit"

const createSchema = z.object({
  gymId: z.string(),
  role: z.enum(["ATHLETE", "COACH", "ADMIN"]).default("ATHLETE"),
  maxUses: z.number().int().positive().nullable().optional(),
  expiresInDays: z.number().int().positive().max(365).nullable().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(writeLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const guard = await requireGymMember(
    session.user.id,
    parsed.data.gymId,
    Role.COACH,
  )
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const code = await generateUniqueCode()
  const expiresAt = parsed.data.expiresInDays
    ? new Date(Date.now() + parsed.data.expiresInDays * 86400000)
    : null

  const created = await prisma.inviteCode.create({
    data: {
      code,
      gymId: parsed.data.gymId,
      role: parsed.data.role,
      maxUses: parsed.data.maxUses ?? null,
      expiresAt,
      createdById: session.user.id,
    },
  })

  return Response.json(created, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(searchLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const gymId = req.nextUrl.searchParams.get("gymId")
  if (!gymId) {
    return Response.json({ error: "Missing gymId" }, { status: 400 })
  }

  const guard = await requireGymMember(session.user.id, gymId, Role.COACH)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const codes = await prisma.inviteCode.findMany({
    where: { gymId },
    orderBy: { createdAt: "desc" },
  })

  const now = Date.now()
  const enriched = codes.map((c) => {
    let status: "active" | "revoked" | "expired" | "exhausted" = "active"
    if (c.revokedAt) status = "revoked"
    else if (c.expiresAt && c.expiresAt.getTime() < now) status = "expired"
    else if (c.maxUses !== null && c.usesCount >= c.maxUses) status = "exhausted"
    return { ...c, status }
  })

  return Response.json(enriched)
}
