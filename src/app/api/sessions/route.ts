import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { requireGymMember } from "@/lib/auth-guards"
import prisma from "@/lib/prisma"

const sessionSchema = z.object({
  gymId: z.string(),
  duration: z.number().int().positive(),
  intensity: z.number().int().min(1).max(10),
  type: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json();
  const result = sessionSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ error: "Invalid Input"} , {status: 400 });
  }

  const guard = await requireGymMember(session.user.id, result.data.gymId)

  if (!guard.ok) {
    return Response.json({ error: "forbidden"} , {status: guard.status });
  }

  const record = await prisma.trainingSession.create({data: {userId: session.user.id, gymId: result.data.gymId, duration: result.data.duration, intensity: result.data.intensity, type: result.data.type}})

  return Response.json(record)
}
