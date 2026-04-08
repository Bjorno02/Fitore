import Link from "next/link"

/* Bevel sheen on number panel */
const PANEL_SHEEN: React.CSSProperties = {
  background: "linear-gradient(145deg, rgba(255,255,255,0.14) 0%, transparent 45%, rgba(0,0,0,0.18) 100%)",
}

/* Lime radial glow inside number panel */
const PANEL_GLOW: React.CSSProperties = {
  background: "radial-gradient(ellipse at center, rgba(132,204,22,0.14) 0%, transparent 75%)",
}

/* Lime accent glow from bottom-left of card content */
const CONTENT_GLOW: React.CSSProperties = {
  background: "radial-gradient(ellipse 80% 70% at 0% 100%, rgba(132,204,22,0.08) 0%, transparent 70%)",
}

/* Background ambient glow — top-right */
const BG_GLOW_A: React.CSSProperties = {
  background: "radial-gradient(ellipse 55% 45% at 90% 8%, rgba(132,204,22,0.10) 0%, transparent 70%)",
}

/* Background ambient glow — bottom-left */
const BG_GLOW_B: React.CSSProperties = {
  background: "radial-gradient(ellipse 45% 40% at 10% 92%, rgba(101,163,13,0.08) 0%, transparent 70%)",
}

function ActionCard({
  href, num, label, title, desc, accentA, accentB,
}: {
  href: string; num: string; label: string; title: string
  desc: string; accentA: string; accentB: string
}) {
  return (
    <Link
      href={href}
      className="frost-card rounded-2xl overflow-hidden group cursor-pointer no-underline block active:scale-[0.98] active:brightness-95 transition-transform"
      style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
    >
      <div className="flex" style={{ minHeight: 176 }}>

        {/* Number panel */}
        <div
          className="relative flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{ width: 96, background: `linear-gradient(160deg, ${accentA} 0%, ${accentB} 100%)` }}
        >
          <div className="absolute inset-0" style={PANEL_SHEEN} />
          <div className="absolute inset-0" style={PANEL_GLOW} />
          {/* Vertical lime hairline on right edge */}
          <div className="absolute right-0 inset-y-4" style={{ width: 1, background: "linear-gradient(180deg, transparent, rgba(132,204,22,0.30), transparent)" }} />
          <span className="relative select-none" style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 900,
            fontSize: "4rem",
            color: "rgba(255,255,255,0.22)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}>{num}</span>
        </div>

        {/* Content */}
        <div className="relative flex-1 px-7 py-6 flex flex-col overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={CONTENT_GLOW} />
          <div className="relative flex flex-col flex-1">
            <p className="frost-label mb-3">{label}</p>
            <h2 className="wordmark text-2xl mb-2 leading-tight" style={{ color: "#84cc16" }}>{title}</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(148,163,184,0.62)" }}>{desc}</p>
            <div
              className="mt-auto pt-3 flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(148,163,184,0.09)" }}
            >
              <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(148,163,184,0.38)" }}>Enter</span>
              <span
                className="transition-transform duration-200 group-hover:translate-x-1.5"
                style={{ color: "rgba(132,204,22,0.65)", fontSize: "1.05rem" }}
              >→</span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}

type Props = { isCoach: boolean }

export default function HomeCards({ isCoach }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-12 py-14 frost-enter-2 relative overflow-hidden">

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none" style={BG_GLOW_A} />
      <div className="absolute inset-0 pointer-events-none" style={BG_GLOW_B} />

      <div className="relative flex flex-col w-full" style={{ maxWidth: 440 }}>

        <div className="flex flex-col gap-5">

          <ActionCard
            href="/athlete"
            num="01"
            label="Athlete"
            title="Log Training"
            desc="Record sessions & daily check-ins"
            accentA="#18181b"
            accentB="#27272a"
          />

          {isCoach && (
            <ActionCard
              href="/dashboard"
              num="02"
              label="Coach"
              title="Dashboard"
              desc="Athlete load & readiness"
              accentA="#141417"
              accentB="#1c1c1f"
            />
          )}

        </div>
      </div>
    </div>
  )
}
