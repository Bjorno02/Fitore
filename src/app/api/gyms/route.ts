import { NextRequest } from "next/server"
import { z } from "zod"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"

const createGymSchema = z.object({
  name: z.string().min(1),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const result = createGymSchema.safeParse(body)
  if (!result.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }

  const gym = await prisma.gym.create({
    data: {
      name: result.data.name,
      memberships: {
        create: {
          userId: session.user.id,
          role: "ADMIN",
          status: "ACTIVE",
        },
      },
    },
  })

  return Response.json(gym, { status: 201 })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const search = req.nextUrl.searchParams.get("search") ?? ""

  const gyms = await prisma.gym.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : undefined,
    select: { id: true, name: true },
    take: 20,
  })

  return Response.json(gyms)
}
