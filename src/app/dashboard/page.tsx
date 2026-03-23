import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { calcLoad, calcReadiness } from "@/lib/scoring"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      role: { in: ["COACH", "ADMIN"] },
    },
    include: { gym: true },
  })

  if (!membership) {
    return <p>You are not a coach at any gym.</p>
  }

  const [sessions, checkins] = await Promise.all([
    prisma.trainingSession.findMany({
      where: { gymId: membership.gymId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.checkIn.findMany({
      where: { gymId: membership.gymId },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ])


  return (
    <main>
      <h1>{membership.gym.name} — Coach Dashboard</h1>
        <div> 
          {sessions.map(s => ( 
            <div key={s.id}>
              <p>{s.user.name}</p>
              <p>Load: {calcLoad(s.duration, s.intensity, s.type)}</p>
            </div>
          ))}
        </div>
        <div>
        {checkins.map(c => ( 
            <div key={c.id}>
              <p>{c.user.name}</p>
              <p>Readiness: {calcReadiness(c.sleep, c.soreness, c.stress, c.injury)}</p>
            </div>
          ))}
        </div>
    </main>
  )
}
