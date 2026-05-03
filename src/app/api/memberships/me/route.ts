import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { Role } from "@/generated/prisma/enums"
import prisma from "@/lib/prisma"
import { writeLimit, checkLimit, rateLimitResponse } from "@/lib/rate-limit"

const leaveSchema = z.object({
  gymId: z.string().min(1),
})

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(writeLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const fromQuery = req.nextUrl.searchParams.get("gymId")
  let gymId: string | undefined = fromQuery ?? undefined

  if (!gymId) {
    const body = await req.json().catch(() => null)
    const parsed = leaveSchema.safeParse(body)
    if (parsed.success) gymId = parsed.data.gymId
  }

  if (!gymId) {
    return Response.json({ error: "missing_gymId" }, { status: 400 })
  }

  const membership = await prisma.membership.findUnique({
    where: { userId_gymId: { userId: session.user.id, gymId } },
  })
  if (!membership || membership.status !== "ACTIVE") {
    return Response.json({ error: "not_a_member" }, { status: 404 })
  }

  if (membership.role === Role.ADMIN) {
    const adminCount = await prisma.membership.count({
      where: { gymId, role: Role.ADMIN, status: "ACTIVE" },
    })
    if (adminCount <= 1) {
      return Response.json({ error: "last_admin" }, { status: 409 })
    }
  }

  await prisma.membership.delete({
    where: { id: membership.id },
  })

  return new Response(null, { status: 204 })
}
