import { randomBytes } from "crypto"
import prisma from "@/lib/prisma"
import type { Role } from "@/generated/prisma/enums"

export type RedeemError =
  | "invalid_code"
  | "expired"
  | "exhausted"
  | "revoked"
  | "already_member"

export type RedeemResult =
  | {
      ok: true
      membership: {
        id: string
        userId: string
        gymId: string
        role: Role
      }
      gym: { id: string; name: string }
    }
  | { ok: false; error: RedeemError }

export function generateCode(): string {
  const raw = randomBytes(4).toString("hex")
  return `${raw.slice(0, 4)}-${raw.slice(4)}`
}

export async function generateUniqueCode(maxAttempts = 5): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = generateCode()
    const existing = await prisma.inviteCode.findUnique({
      where: { code: candidate },
      select: { id: true },
    })
    if (!existing) return candidate
  }
  throw new Error("Could not generate unique invite code")
}

export async function redeemCode(
  code: string,
  userId: string,
): Promise<RedeemResult> {
  try {
    return await prisma.$transaction(async (tx) => {
      const invite = await tx.inviteCode.findUnique({
        where: { code },
        include: { gym: { select: { id: true, name: true } } },
      })

      if (!invite) return { ok: false, error: "invalid_code" } as const
      if (invite.revokedAt) return { ok: false, error: "revoked" } as const
      if (invite.expiresAt && invite.expiresAt < new Date()) {
        return { ok: false, error: "expired" } as const
      }
      if (invite.maxUses !== null && invite.usesCount >= invite.maxUses) {
        return { ok: false, error: "exhausted" } as const
      }

      const existing = await tx.membership.findUnique({
        where: { userId_gymId: { userId, gymId: invite.gymId } },
        select: { id: true },
      })
      if (existing) return { ok: false, error: "already_member" } as const

      const membership = await tx.membership.create({
        data: {
          userId,
          gymId: invite.gymId,
          role: invite.role,
          status: "ACTIVE",
        },
        select: { id: true, userId: true, gymId: true, role: true },
      })

      await tx.inviteCode.update({
        where: { id: invite.id },
        data: { usesCount: { increment: 1 } },
      })

      return { ok: true, membership, gym: invite.gym } as const
    })
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return { ok: false, error: "already_member" }
    }
    throw err
  }
}
