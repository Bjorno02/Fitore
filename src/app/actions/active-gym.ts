"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { setActiveGymCookie } from "@/lib/active-gym"

export async function setActiveGym(gymId: string) {
  const session = await auth()
  if (!session?.user?.id) return { ok: false as const, error: "unauthorized" }

  const membership = await prisma.membership.findUnique({
    where: { userId_gymId: { userId: session.user.id, gymId } },
    select: { id: true, status: true },
  })

  if (!membership || membership.status !== "ACTIVE") {
    return { ok: false as const, error: "not_a_member" }
  }

  await setActiveGymCookie(gymId)
  revalidatePath("/", "layout")
  return { ok: true as const }
}
