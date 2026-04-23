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
    return (
      <main className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "var(--tracking-label)",
            color: "var(--color-ink-muted)",
          }}
        >
          — You are not a member of any gym —
        </p>
      </main>
    )
  }

  return (
    <main>
      <PageHeader
        label={membership.gym.name}
        title="Training Log"
        meta={session.user.name ?? undefined}
      />
      <div className="mx-auto max-w-6xl px-6 pb-20 md:px-12">
        <div className="mb-8 flex justify-end">
          <Link
            href="/athlete/history"
            className="group inline-flex items-center gap-3 transition-opacity hover:opacity-100"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              color: "var(--color-ink)",
              opacity: 0.7,
            }}
          >
            <span>View History</span>
            <span
              style={{ color: "var(--color-accent)" }}
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
        <AthleteForm gymId={membership.gymId} />
      </div>
    </main>
  )
}
