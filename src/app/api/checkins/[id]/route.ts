import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { writeLimit, checkLimit, rateLimitResponse } from "@/lib/rate-limit"

const patchSchema = z.object({
  sleep: z.number().int().min(1).max(10).optional(),
  soreness: z.number().int().min(1).max(10).optional(),
  injury: z.boolean().optional(),
  stress: z.number().int().min(1).max(10).optional(),
})

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

  const record = await prisma.checkIn.findUnique({
    where: { id },
    select: { id: true, userId: true },
  })

  if (!record) {
    return Response.json({ error: "not_found" }, { status: 404 })
  }
  if (record.userId !== session.user.id) {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  await prisma.checkIn.delete({ where: { id } })

  return new Response(null, { status: 204 })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(writeLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const { id } = await params

  const record = await prisma.checkIn.findUnique({
    where: { id },
    select: { id: true, userId: true },
  })

  if (!record) {
    return Response.json({ error: "not_found" }, { status: 404 })
  }
  if (record.userId !== session.user.id) {
    return Response.json({ error: "forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "invalid_input" }, { status: 400 })
  }

  const updated = await prisma.checkIn.update({
    where: { id },
    data: parsed.data,
  })

  return Response.json(updated)
}
