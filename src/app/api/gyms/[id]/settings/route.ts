import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { requireGymMember } from "@/lib/auth-guards"
import { Role } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { DEFAULT_LOAD_CONFIG, DEFAULT_READINESS_CONFIG } from "@/lib/scoring"
import { writeLimit, checkLimit, rateLimitResponse } from "@/lib/rate-limit"

const settingsSchema = z.object({
  multiplierSparring: z.number().min(0).max(10),
  multiplierDrilling: z.number().min(0).max(10),
  multiplierConditioning: z.number().min(0).max(10),
  multiplierWeights: z.number().min(0).max(10),
  sleepWeight: z.number().min(0).max(5),
  sorenessWeight: z.number().min(0).max(5),
  stressWeight: z.number().min(0).max(5),
  injuryPenalty: z.number().min(0).max(100),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: gymId } = await params
  const guard = await requireGymMember(session.user.id, gymId)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const settings = await prisma.gymSettings.findUnique({
    where: { gymId },
    select: {
      multiplierSparring: true,
      multiplierDrilling: true,
      multiplierConditioning: true,
      multiplierWeights: true,
      sleepWeight: true,
      sorenessWeight: true,
      stressWeight: true,
      injuryPenalty: true,
    },
  })
  if (!settings) {
    return Response.json({
      multiplierSparring: DEFAULT_LOAD_CONFIG.typeMultipliers.sparring,
      multiplierDrilling: DEFAULT_LOAD_CONFIG.typeMultipliers.drilling,
      multiplierConditioning: DEFAULT_LOAD_CONFIG.typeMultipliers.conditioning,
      multiplierWeights: DEFAULT_LOAD_CONFIG.typeMultipliers.weights,
      sleepWeight: DEFAULT_READINESS_CONFIG.sleepWeight,
      sorenessWeight: DEFAULT_READINESS_CONFIG.sorenessWeight,
      stressWeight: DEFAULT_READINESS_CONFIG.stressWeight,
      injuryPenalty: DEFAULT_READINESS_CONFIG.injuryPenalty,
    })
  }

  return Response.json(settings)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(writeLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const { id: gymId } = await params
  const guard = await requireGymMember(session.user.id, gymId, Role.COACH)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const body = await req.json()
  const result = settingsSchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const settings = await prisma.gymSettings.upsert({
    where: { gymId },
    create: { gymId, ...result.data },
    update: result.data,
  })

  return Response.json(settings)
}
