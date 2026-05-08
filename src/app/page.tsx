import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import HomeHero from "./HomeHero"
import HomeCards from "./HomeCards"
import { getActiveGymContext } from "@/lib/active-gym"

export default async function Home() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const ctx = await getActiveGymContext(session.user.id)
  if (!ctx) redirect("/onboarding")

  const isCoach =
    ctx.active.role === "COACH" || ctx.active.role === "ADMIN"

  return (
    <main>
      <HomeHero
        gymName={ctx.active.gym.name}
        userName={session.user.name}
      />
      <div className="mx-auto max-w-6xl px-5 pb-24 md:px-12">
        <HomeCards isCoach={isCoach} />
        <div className="mt-20 flex justify-center">
          <Link
            href="/how-it-works"
            className="group inline-flex items-center gap-3 py-3 transition-opacity hover:opacity-100"
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
