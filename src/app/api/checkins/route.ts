import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import { requireGymMember } from "@/lib/auth-guards"
import prisma from "@/lib/prisma"

const checkinSchema = z.object({
  gymId: z.string(),
  sleep: z.number().int().min(1).max(10),
  soreness: z.number().int().min(1).max(10),
  injury: z.boolean(),
  stress: z.number().int().min(1).max(10),
})

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const body = await req.json();
  const result = checkinSchema.safeParse(body);

  if (!result.success) {
    return Response.json({ error: "Invalid Input"} , {status: 400 });
  }

  const guard = await requireGymMember(session.user.id, result.data.gymId)

  if (!guard.ok) {
    return Response.json({ error: "forbidden"} , {status: guard.status });
  }

  const record = await prisma.checkIn.create({data: {userId: session.user.id, gymId: result.data.gymId, sleep: result.data.sleep, soreness: result.data.soreness, injury: result.data.injury, stress: result.data.stress }})

  return Response.json(record)
}
