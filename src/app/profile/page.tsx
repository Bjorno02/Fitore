import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { DoubleHeadedEagle, DotGrid } from "@/components/Ornaments"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { gym: true },
  })
  if (!membership) redirect("/onboarding")

  const isPending = membership.status === "PENDING"
  const filedOn = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const fileNo = membership.id.slice(-6).toUpperCase()

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{ top: "12%", right: "4%", opacity: 0.055 }}
        aria-hidden="true"
      >
        <DoubleHeadedEagle size={260} color="var(--color-ink)" />
      </div>

      <DotGrid
        cols={16}
        rows={7}
        size={2}
        gap={11}
        color="var(--color-ink)"
        style={{
          position: "absolute",
          bottom: 120,
          left: 40,
          opacity: 0.08,
          pointerEvents: "none",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b py-4"
          style={{
            borderColor: "var(--color-rule)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
            textTransform: "uppercase",
            color: "var(--color-ink-muted)",
          }}
        >
          <span>
            Fitore<span style={{ color: "var(--color-accent)" }}>.</span>
          </span>
          <span className="hidden md:inline">Member Profile · Private</span>
          <span>No. {fileNo}</span>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-12 pt-16 md:px-12 md:pt-20">
        <div
          className="mb-8 flex items-center gap-3"
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
          <span>[Profile] — Your Record</span>
        </div>

        <h1
          className="gradient-text-ink"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 800,
            fontSize: "var(--text-display-lg)",
            lineHeight: "var(--leading-display)",
            letterSpacing: "var(--tracking-display)",
            textTransform: "uppercase",
          }}
        >
          {session.user.name ?? "Athlete"}
          <span style={{ color: "var(--color-accent)" }}>.</span>
        </h1>
      </section>

      {isPending && (
        <section className="mx-auto max-w-6xl px-6 pb-16 md:px-12">
          <div
            className="border p-8 md:p-10"
            style={{
              backgroundColor: "var(--color-canvas-raised)",
              borderColor: "var(--color-rule-strong)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              className="mb-6 flex items-baseline justify-between border-b pb-3"
              style={{ borderColor: "var(--color-rule-strong)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-eyebrow)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                }}
              >
                <span style={{ color: "var(--color-accent)" }}>§</span> Pending
                Access
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-eyebrow)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--color-ink-faint)",
                }}
              >
                Filed · {filedOn}
              </span>
            </div>

            <h2
              className="mb-5"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "var(--text-display-md)",
                lineHeight: "var(--leading-display)",
                letterSpacing: "var(--tracking-display)",
                textTransform: "uppercase",
                color: "var(--color-ink)",
              }}
            >
              {membership.gym.name}
              <span style={{ color: "var(--color-accent)" }}>.</span>
            </h2>

            <p
              className="max-w-2xl"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "17px",
                lineHeight: 1.7,
                color: "var(--color-ink-soft)",
              }}
            >
              Your request has joined the queue. A coach will review and
              approve you —{" "}
              <em
                style={{
                  color: "var(--color-accent)",
                  fontStyle: "italic",
                  fontWeight: 600,
                }}
              >
                typically within 24 hours.
              </em>{" "}
              Until then, logging and dashboard access are held.
            </p>

            <div
              className="mt-8 flex items-center gap-6 border-t pt-5"
              style={{ borderColor: "var(--color-rule)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                }}
              >
                Status · <span style={{ color: "var(--color-accent)" }}>Awaiting Coach</span>
              </span>
              <span
                aria-hidden="true"
                style={{ color: "var(--color-ink-faint)" }}
              >
                ·
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  letterSpacing: "var(--tracking-label)",
                  textTransform: "uppercase",
                  color: "var(--color-ink-muted)",
                }}
              >
                Role · {membership.role}
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-12">
        <div
          className="mb-6 flex items-baseline justify-between border-b pb-3"
          style={{ borderColor: "var(--color-rule-strong)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
            }}
          >
            <span style={{ color: "var(--color-accent)" }}>§ 01</span> Identity
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--color-ink-faint)",
            }}
          >
            Record
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Field label="Name" value={session.user.name ?? "—"} />
          <Field label="Email" value={session.user.email ?? "—"} />
          <Field
            label="Gym"
            value={membership.gym.name}
            accent={isPending ? "pending" : null}
          />
        </dl>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 border px-5 py-3 transition-all hover:-translate-y-0.5"
            style={{
              borderColor: "var(--color-ink)",
              color: "var(--color-ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-label)",
            }}
          >
            <span>Back to Home</span>
            <span
              aria-hidden="true"
              style={{ color: "var(--color-accent)" }}
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}

function Field({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: "pending" | null
}) {
  return (
    <div
      className="border-t pt-4"
      style={{ borderColor: "var(--color-rule)" }}
    >
      <dt
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
        }}
      >
        {label}
      </dt>
      <dd
        className="mt-2 flex items-baseline gap-2"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "18px",
          fontWeight: 500,
          color: "var(--color-ink)",
        }}
      >
        <span>{value}</span>
        {accent === "pending" && (
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "var(--tracking-label)",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            · Pending
          </span>
        )}
      </dd>
    </div>
  )
}
