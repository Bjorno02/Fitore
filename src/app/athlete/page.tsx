import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import AthleteForm from "./AthleteForm"

export default async function AthletePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/login")
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { gym: true },
  })

  if (!membership) {
    return <p className="text-text-muted p-6">You are not a member of any gym.</p>
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <div className="mb-8">
        <p className="text-text-muted text-xs tracking-widest uppercase mb-1">{membership.gym.name}</p>
        <h1 className="wordmark text-3xl text-blue-900 tracking-wide">Training Log</h1>
      </div>
      <AthleteForm gymId={membership.gymId} />
    </main>
  )
}
