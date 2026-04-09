const BLOOM: React.CSSProperties = {
  background: "radial-gradient(ellipse 70% 120% at 50% 50%, rgba(132,204,22,0.12) 0%, transparent 70%)",
}

function TopoLines() {
  const lines = [
    { y: 18,  c: "rgba(132,204,22,0.18)" },
    { y: 45,  c: "rgba(101,163,13,0.14)" },
    { y: 72,  c: "rgba(132,204,22,0.15)" },
    { y: 99,  c: "rgba(77,124,15,0.11)"  },
    { y: 126, c: "rgba(132,204,22,0.10)" },
  ]
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 140"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "blur(0.5px)" }}
    >
      <defs>
        <filter id="ph-glow">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {lines.map(({ y, c }, i) => {
        const p = i % 2 === 0 ? 1 : -1
        const a = 18 + (i % 3) * 6
        return (
          <path
            key={i}
            d={`M-60,${y} C180,${y - a * p} 360,${y + a * p} 560,${y} S860,${y - a * p} 1000,${y + a * p / 2} S1200,${y} 1260,${y}`}
            fill="none"
            stroke={c}
            strokeWidth="1.1"
            filter="url(#ph-glow)"
          />
        )
      })}
    </svg>
  )
}

type Props = {
  label: string
  title: string
  meta?: string
}

export default function PageHeader({ label, title, meta }: Props) {
  return (
    <div
      className="relative overflow-hidden px-6 py-10 frost-enter"
      style={{
        background: "linear-gradient(135deg, #050a01 0%, #020600 55%, #000000 100%)",
        borderBottom: "1px solid rgba(132,204,22,0.25)",
        boxShadow: "0 4px 32px rgba(4,10,22,0.35)",
      }}
    >
      <TopoLines />
      <div className="absolute inset-0 pointer-events-none" style={BLOOM} />

      <div className="relative max-w-5xl mx-auto text-center">
        <p className="frost-label justify-center mb-3" style={{ color: "rgba(148,163,184,0.65)" }}>{label}</p>

        <div className="h-px mb-5 w-37 mx-auto" style={{
          background: "linear-gradient(90deg, transparent, #84cc16, #65a30d, transparent)"
        }} />

        <h1
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            lineHeight: 0.92,
            background: "linear-gradient(130deg, #3f3f46 0%, #84cc16 22%, #ecfccb 42%, #4d7c0f 62%, #a3e635 82%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 16px rgba(132,204,22,0.22))",
          }}
        >
          {title}
        </h1>

        {meta && (
          <p className="mt-4 text-xs tracking-[0.14em] uppercase text-center"
            style={{ color: "rgba(148,163,184,0.38)" }}>
            {meta}
          </p>
        )}
      </div>
    </div>
  )
}
