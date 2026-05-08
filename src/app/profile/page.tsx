import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { DoubleHeadedEagle, DotGrid } from "@/components/Ornaments"
import LeaveGymButton from "./LeaveGymButton"
import { getActiveGymContext } from "@/lib/active-gym"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const ctx = await getActiveGymContext(session.user.id)
  if (!ctx) redirect("/onboarding")

  const fileNo = ctx.active.id.slice(-6).toUpperCase()
  const memberships = ctx.all

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

      <div className="mx-auto max-w-6xl px-5 md:px-12">
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

      <section className="mx-auto max-w-6xl px-5 pb-12 pt-16 md:px-12 md:pt-20">
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

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-12">
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

        <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Field label="Name" value={session.user.name ?? "—"} />
          <Field label="Email" value={session.user.email ?? "—"} />
        </dl>

        <div
          className="mt-16 mb-6 flex items-baseline justify-between border-b pb-3"
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
            <span style={{ color: "var(--color-accent)" }}>§ 02</span> Memberships
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
            {memberships.length} active
          </span>
        </div>

        <div className="flex flex-col">
          {memberships.map((m) => (
            <div
              key={m.gymId}
              className="border-b py-5"
              style={{ borderColor: "var(--color-rule)" }}
            >
              <div className="mb-4 flex items-center justify-between gap-4">
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "var(--color-ink)",
                  }}
                >
                  {m.gym.name}
                  {m.gymId === ctx.active.gymId && (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "10px",
                        letterSpacing: "var(--tracking-label)",
                        textTransform: "uppercase",
                        color: "var(--color-accent)",
                        marginLeft: "10px",
                      }}
                    >
                      · Active
                    </span>
                  )}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    letterSpacing: "var(--tracking-label)",
                    textTransform: "uppercase",
                    color:
                      m.role === "ADMIN"
                        ? "var(--color-accent)"
                        : "var(--color-ink-muted)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.role}
                </span>
              </div>
              <LeaveGymButton gymId={m.gymId} gymName={m.gym.name} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-3 border px-5 py-3.5 transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--color-accent)",
              borderColor: "var(--color-accent-hover)",
              color: "var(--color-accent-ink)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "var(--tracking-label)",
            }}
          >
            <span>+ Join Another Gym</span>
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/"
            className="group inline-flex items-center gap-3 border px-5 py-3.5 transition-all hover:-translate-y-0.5"
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

function Field({ label, value }: { label: string; value: string }) {
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
        className="mt-2"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "18px",
          fontWeight: 500,
          color: "var(--color-ink)",
        }}
      >
        {value}
      </dd>
    </div>
  )
}
