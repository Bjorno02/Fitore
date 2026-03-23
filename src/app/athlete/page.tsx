import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import AthleteForm from "./AthleteForm"

export default async function AthletePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { gym: true },
  })

  if (!membership) {
    return <p>You are not a member of any gym.</p>
  }

  return (
    <main>
      <h1>{membership.gym.name}</h1>
      <AthleteForm gymId={membership.gymId} />
    </main>
  )
}
