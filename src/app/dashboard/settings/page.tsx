import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import PageHeader from "@/components/PageHeader"
import { DEFAULT_LOAD_CONFIG, DEFAULT_READINESS_CONFIG } from "@/lib/scoring"
import SettingsForm from "./SettingsForm"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, role: { in: ["COACH", "ADMIN"] }, status: "ACTIVE" },
    include: { gym: true },
  })

  if (!membership) redirect("/dashboard")

  const settings = await prisma.gymSettings.findUnique({
    where: { gymId: membership.gymId },
  })

  const initial = {
    multiplierSparring: settings?.multiplierSparring ?? DEFAULT_LOAD_CONFIG.typeMultipliers.sparring,
    multiplierDrilling: settings?.multiplierDrilling ?? DEFAULT_LOAD_CONFIG.typeMultipliers.drilling,
    multiplierConditioning: settings?.multiplierConditioning ?? DEFAULT_LOAD_CONFIG.typeMultipliers.conditioning,
    multiplierWeights: settings?.multiplierWeights ?? DEFAULT_LOAD_CONFIG.typeMultipliers.weights,
    sleepWeight: settings?.sleepWeight ?? DEFAULT_READINESS_CONFIG.sleepWeight,
    sorenessWeight: settings?.sorenessWeight ?? DEFAULT_READINESS_CONFIG.sorenessWeight,
    stressWeight: settings?.stressWeight ?? DEFAULT_READINESS_CONFIG.stressWeight,
    injuryPenalty: settings?.injuryPenalty ?? DEFAULT_READINESS_CONFIG.injuryPenalty,
  }

  return (
    <main className="flex-1 flex flex-col">
      <PageHeader label={membership.gym.name} title="Settings" />
      <div className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <SettingsForm gymId={membership.gymId} initial={initial} />
        </div>
      </div>
    </main>
  )
}
