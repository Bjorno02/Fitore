import { auth } from "@/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  })

  if (!membership) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">MartialOps</h1>
        <p className="text-zinc-500">You are not a member of any gym.</p>
      </main>
    )
  }

  const isCoach = membership.role === "COACH" || membership.role === "ADMIN"

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-semibold">MartialOps</h1>
      <p className="text-zinc-500">Welcome, {session.user.name}</p>
      <div className="flex gap-4">
        <Link href="/athlete" className="rounded-lg bg-black px-5 py-2 text-white hover:bg-zinc-800">
          Log Training
        </Link>
        {isCoach && (
          <Link href="/dashboard" className="rounded-lg border px-5 py-2 hover:bg-zinc-100">
            Coach Dashboard
          </Link>
        )}
      </div>
    </main>
  )
}
