import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"
import HomeHero from "./HomeHero"
import HomeCards from "./HomeCards"

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
      <main className="mx-auto max-w-3xl px-6 py-32 md:px-12">
        <div
          className="border-t pt-6"
          style={{ borderColor: "var(--color-rule-strong)" }}
        >
          <div
            className="mb-6 flex items-center gap-3"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block"
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: "var(--color-accent)",
                transform: "rotate(45deg)",
              }}
            />
            <span>Pending Approval</span>
          </div>
          <h1
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 800,
              fontSize: "var(--text-display-lg)",
              lineHeight: "var(--leading-display)",
              letterSpacing: "var(--tracking-display)",
              textTransform: "uppercase",
              color: "var(--color-ink)",
            }}
          >
            {membership.gym.name}
            <span style={{ color: "var(--color-accent)" }}>.</span>
          </h1>
          <p
            className="mt-8 max-w-xl"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "18px",
              lineHeight: 1.7,
              color: "var(--color-ink-soft)",
            }}
          >
            Your request to join is pending approval. A coach will review it soon.
          </p>
        </div>
      </main>
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
