import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { requireGymMember } from "@/lib/auth-guards"
import { Role } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { approvalLimit, checkLimit, rateLimitResponse } from "@/lib/rate-limit"

const patchSchema = z.object({
  action: z.enum(["approve", "deny"]),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(approvalLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const { id: gymId, userId } = await params
  const guard = await requireGymMember(session.user.id, gymId, Role.ADMIN)
  if (!guard.ok) {
    return Response.json({ error: "Forbidden" }, { status: guard.status })
  }

  const body = await req.json()
  const result = patchSchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  if (result.data.action === "approve") {
    const membership = await prisma.membership.update({
      where: { userId_gymId: { userId, gymId } },
      data: { status: "ACTIVE" },
    })
    return Response.json(membership)
  } else {
    await prisma.membership.delete({
      where: { userId_gymId: { userId, gymId } },
    })
    return new Response(null, { status: 204 })
  }
}
