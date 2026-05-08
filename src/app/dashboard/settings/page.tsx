import { redirect } from "next/navigation"
import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import PageHeader from "@/components/PageHeader"
import { DEFAULT_LOAD_CONFIG, DEFAULT_READINESS_CONFIG } from "@/lib/scoring"
import SettingsForm from "./SettingsForm"
import { getActiveGymContext } from "@/lib/active-gym"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const ctx = await getActiveGymContext(session.user.id)
  const membership =
    ctx && (ctx.active.role === "COACH" || ctx.active.role === "ADMIN")
      ? ctx.active
      : null

  if (!membership) redirect("/dashboard")

  const settings = await prisma.gymSettings.findUnique({
    where: { gymId: membership.gymId },
  })

  const initial = {
    multiplierSparring:
      settings?.multiplierSparring ??
      DEFAULT_LOAD_CONFIG.typeMultipliers.sparring,
    multiplierDrilling:
      settings?.multiplierDrilling ??
      DEFAULT_LOAD_CONFIG.typeMultipliers.drilling,
    multiplierConditioning:
      settings?.multiplierConditioning ??
      DEFAULT_LOAD_CONFIG.typeMultipliers.conditioning,
    multiplierWeights:
      settings?.multiplierWeights ??
      DEFAULT_LOAD_CONFIG.typeMultipliers.weights,
    sleepWeight:
      settings?.sleepWeight ?? DEFAULT_READINESS_CONFIG.sleepWeight,
    sorenessWeight:
      settings?.sorenessWeight ?? DEFAULT_READINESS_CONFIG.sorenessWeight,
    stressWeight:
      settings?.stressWeight ?? DEFAULT_READINESS_CONFIG.stressWeight,
    injuryPenalty:
      settings?.injuryPenalty ?? DEFAULT_READINESS_CONFIG.injuryPenalty,
  }

  return (
    <main>
      <PageHeader
        label={membership.gym.name}
        title="Settings"
        meta="Coach · Weights & Multipliers"
      />
      <div className="mx-auto max-w-3xl px-5 pb-24 md:px-12">
        <SettingsForm gymId={membership.gymId} initial={initial} />
      </div>
    </main>
  )
}
