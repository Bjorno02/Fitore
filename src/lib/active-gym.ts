import { cookies } from "next/headers"
import prisma from "./prisma"

const COOKIE_NAME = "active-gym"

export type ActiveGymContext = {
  active: {
    id: string
    userId: string
    gymId: string
    role: "ATHLETE" | "COACH" | "ADMIN"
    gym: { id: string; name: string }
  }
  all: Array<{
    id: string
    userId: string
    gymId: string
    role: "ATHLETE" | "COACH" | "ADMIN"
    gym: { id: string; name: string }
  }>
}

export async function getActiveGymContext(
  userId: string,
): Promise<ActiveGymContext | null> {
  const memberships = await prisma.membership.findMany({
    where: { userId, status: "ACTIVE" },
    include: { gym: { select: { id: true, name: true } } },
    orderBy: { id: "asc" },
  })

  if (memberships.length === 0) return null

  const cookieStore = await cookies()
  const cookieGymId = cookieStore.get(COOKIE_NAME)?.value

  let active = memberships[0]
  if (cookieGymId) {
    const fromCookie = memberships.find((m) => m.gymId === cookieGymId)
    if (fromCookie) active = fromCookie
  }

  return {
    active: {
      id: active.id,
      userId: active.userId,
      gymId: active.gymId,
      role: active.role,
      gym: active.gym,
    },
    all: memberships.map((m) => ({
      id: m.id,
      userId: m.userId,
      gymId: m.gymId,
      role: m.role,
      gym: m.gym,
    })),
  }
}

export async function setActiveGymCookie(gymId: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, gymId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    httpOnly: false,
  })
}
