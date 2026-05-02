import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { requireGymMember } from "@/lib/auth-guards"
import { Role } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { joinRequestLimit, checkLimit, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(joinRequestLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const { id: gymId } = await params

  const gym = await prisma.gym.findUnique({ where: { id: gymId } })
  if (!gym) {
    return Response.json({ error: "Gym not found" }, { status: 404 })
  }

  const existing = await prisma.membership.findUnique({
    where: { userId_gymId: { userId: session.user.id, gymId } },
  })
  if (existing) {
    return Response.json({ error: "Already a member or request pending" }, { status: 409 })
  }

  const membership = await prisma.membership.create({
    data: { userId: session.user.id, gymId, role: "ATHLETE", status: "PENDING" },
  })

  return Response.json(membership, { status: 201 })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id: gymId } = await params
  const guard = await requireGymMember(session.user.id, gymId, Role.ADMIN)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const pending = await prisma.membership.findMany({
    where: { gymId, status: "PENDING" },
    include: { user: { select: { id: true, name: true, email: true } } },
  })

  return Response.json(pending)
}
