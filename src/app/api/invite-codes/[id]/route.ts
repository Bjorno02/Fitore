import { NextRequest } from "next/server"
import { auth } from "@/auth"
import { requireGymMember } from "@/lib/auth-guards"
import { Role } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { writeLimit, checkLimit, rateLimitResponse } from "@/lib/rate-limit"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(writeLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const { id } = await params

  const invite = await prisma.inviteCode.findUnique({
    where: { id },
    select: { id: true, gymId: true, revokedAt: true },
  })
  if (!invite) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  const guard = await requireGymMember(session.user.id, invite.gymId, Role.COACH)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  if (invite.revokedAt) {
    return Response.json({ error: "already_revoked" }, { status: 409 })
  }

  const updated = await prisma.inviteCode.update({
    where: { id },
    data: { revokedAt: new Date() },
  })

  return Response.json(updated)
}
