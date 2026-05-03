import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { redeemCode } from "@/lib/invite-codes"
import { redeemLimit, checkLimit, rateLimitResponse } from "@/lib/rate-limit"

const redeemSchema = z.object({
  code: z
    .string()
    .min(1)
    .max(32)
    .transform((s) => s.trim().toLowerCase()),
})

const ERROR_STATUS = {
  invalid_code: 404,
  expired: 410,
  exhausted: 410,
  revoked: 410,
  already_member: 409,
} as const

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const limit = await checkLimit(redeemLimit, session.user.id)
  if (!limit.ok) return rateLimitResponse(limit.retryAfter)

  const body = await req.json()
  const parsed = redeemSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const result = await redeemCode(parsed.data.code, session.user.id)

  if (!result.ok) {
    return Response.json(
      { error: result.error },
      { status: ERROR_STATUS[result.error] },
    )
  }

  return Response.json(
    { membership: result.membership, gym: result.gym },
    { status: 201 },
  )
}
