import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { requireGymMember } from "@/lib/auth-guards"
import { Role } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { writeLimit, checkLimit, rateLimitResponse } from "@/lib/rate-limit"

const ROLE_RANK: Record<Role, number> = {
  ATHLETE: 1,
  COACH: 2,
  ADMIN: 3,
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(writeLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const { id: gymId, userId: targetUserId } = await params

  if (targetUserId === session.user.id) {
    return Response.json(
      { error: "use_leave_endpoint" },
      { status: 400 },
    )
  }

  const guard = await requireGymMember(session.user.id, gymId, Role.COACH)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const [actor, target] = await Promise.all([
    prisma.membership.findUnique({
      where: { userId_gymId: { userId: session.user.id, gymId } },
    }),
    prisma.membership.findUnique({
      where: { userId_gymId: { userId: targetUserId, gymId } },
    }),
  ])

  if (!target || target.status !== "ACTIVE") {
    return Response.json({ error: "not_a_member" }, { status: 404 })
  }
  if (!actor) {
    return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  if (ROLE_RANK[actor.role] <= ROLE_RANK[target.role]) {
    return Response.json({ error: "insufficient_role" }, { status: 403 })
  }

  if (target.role === Role.ADMIN) {
    const adminCount = await prisma.membership.count({
      where: { gymId, role: Role.ADMIN, status: "ACTIVE" },
    })
    if (adminCount <= 1) {
      return Response.json({ error: "last_admin" }, { status: 409 })
    }
  }

  await prisma.membership.delete({
    where: { id: target.id },
  })

  return new Response(null, { status: 204 })
}
