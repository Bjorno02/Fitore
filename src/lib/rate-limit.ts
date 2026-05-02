import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL &&
  !!process.env.UPSTASH_REDIS_REST_TOKEN

const redis = hasUpstash ? Redis.fromEnv() : null

function makeLimiter(
  name: string,
  limit: number,
  window: `${number} ${"ms" | "s" | "m" | "h" | "d"}`,
) {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `rl:${name}`,
    analytics: false,
  })
}

export const writeLimit = makeLimiter("write", 20, "60 s")
export const searchLimit = makeLimiter("search", 30, "60 s")
export const approvalLimit = makeLimiter("approval", 30, "60 s")
export const joinRequestLimit = makeLimiter("join", 5, "1 h")
export const createGymLimit = makeLimiter("create-gym", 3, "1 h")

type LimitOk = { ok: true }
type LimitFail = { ok: false; retryAfter: number }
export type LimitResult = LimitOk | LimitFail

export async function checkLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<LimitResult> {
  if (!limiter) return { ok: true }
  try {
    const result = await limiter.limit(identifier)
    if (result.success) return { ok: true }
    const retryAfter = Math.max(
      1,
      Math.ceil((result.reset - Date.now()) / 1000),
    )
    return { ok: false, retryAfter }
  } catch {
    return { ok: true }
  }
}

export function rateLimitResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "rate_limit", retryAfter },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    },
  )
}
