import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import HomeHero from "./HomeHero"
import HomeCards from "./HomeCards"
import HomePending from "./HomePending"

export default async function Home() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { gym: true },
  })

  if (!membership) redirect("/onboarding")

  if (membership.status === "PENDING") {
    return (
      <HomePending
        gymName={membership.gym.name}
        userName={session.user.name}
        role={membership.role}
      />
    )
  }

  const isCoach =
    membership.role === "COACH" || membership.role === "ADMIN"

  return (
    <main>
      <HomeHero
        gymName={membership.gym.name}
        userName={session.user.name}
      />
      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-12">
        <HomeCards isCoach={isCoach} />
        <div className="mt-20 flex justify-center">
          <Link
            href="/how-it-works"
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
            <span>How It Works</span>
            <span
              style={{ color: "var(--color-accent)" }}
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}
