import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import AthleteForm from "./AthleteForm"
import PageHeader from "@/components/PageHeader"

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
    <main className="flex-1 flex flex-col">
      <PageHeader
        label={membership.gym.name}
        title="Training Log"
        meta={session.user.name ?? undefined}
      />
      <div className="flex-1 px-6 py-8 overflow-hidden flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          <div className="flex justify-end mb-4">
            <Link
              href="/athlete/history"
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "rgba(132,204,22,0.78)" }}
            >
              View History →
            </Link>
          </div>
          <AthleteForm gymId={membership.gymId} />
        </div>
      </div>
    </main>
  )
}
