import prisma from "@/lib/prisma"
import { Role } from "@/generated/prisma/enums"

export type GuardResult =
  | { ok: true; role: Role }
  | { ok: false; status: 401 | 403 }

export async function requireGymMember(
  userId: string | undefined,
  gymId: string,
  requiredRole?: Role
): Promise<GuardResult> {

  if (!userId) {
    return { ok: false, status: 401}
  }

  const membership = await prisma.membership.findUnique({
    where: { userId_gymId: { userId, gymId}}
  })
  
  if (!membership || membership.status !== "ACTIVE") {
    return { ok: false, status: 403}
  }

  if (requiredRole) {
    const ORDER: Role[] = [Role.ATHLETE, Role.COACH, Role.ADMIN]
    if (ORDER.indexOf(membership.role) < ORDER.indexOf(requiredRole)) {
      return {ok: false, status: 403}
    }
  }

  return { ok: true, role: membership.role}
}
