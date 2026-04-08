/* Purple ambient bloom behind center content */
const BLOOM: React.CSSProperties = {
  background: "radial-gradient(ellipse 55% 45% at 50% 55%, rgba(132,204,22,0.10) 0%, transparent 70%)",
}

function TopoLines() {
  // Topographic contour lines — staggered sinusoidal bezier paths
  const lines = [
    { y: 80,  c: "rgba(132,204,22,0.18)" },
    { y: 155, c: "rgba(101,163,13,0.14)" },
    { y: 230, c: "rgba(132,204,22,0.16)" },
    { y: 305, c: "rgba(77,124,15,0.13)"  },
    { y: 380, c: "rgba(132,204,22,0.15)" },
    { y: 455, c: "rgba(101,163,13,0.11)" },
    { y: 530, c: "rgba(132,204,22,0.12)" },
    { y: 605, c: "rgba(77,124,15,0.09)"  },
    { y: 680, c: "rgba(132,204,22,0.08)" },
  ]

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 760"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "blur(0.6px)" }}
    >
      <defs>
        <filter id="line-glow">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {lines.map(({ y, c }, i) => {
        const p = i % 2 === 0 ? 1 : -1
        const a = 28 + (i % 3) * 8
        return (
          <path
            key={i}
            d={`M-60,${y} C120,${y - a * p} 280,${y + a * p} 460,${y} S700,${y - a * p} 820,${y + a * p / 2} S1000,${y} 1060,${y}`}
            fill="none"
            stroke={c}
            strokeWidth="1.2"
            filter="url(#line-glow)"
          />
        )
      })}
    </svg>
  )
}

type Props = { gymName: string; userName: string | null | undefined }

export default function HomeHero({ gymName, userName }: Props) {
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })

  return (
    <div
      className="flex-1 flex flex-col justify-center items-center text-center px-10 py-12 relative overflow-hidden"
      style={{ background: "linear-gradient(150deg, #050a01 0%, #000000 60%, #030500 100%)" }}
    >
      {/* Topographic contour lines */}
      <TopoLines />

      {/* Purple bloom behind center */}
      <div className="absolute inset-0 pointer-events-none" style={BLOOM} />

      {/* Date */}
      <div className="relative flex items-center gap-2.5 mb-8">
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: "#84cc16", boxShadow: "0 0 8px rgba(132,204,22,0.9)" }}
        />
        <span
          className="text-xs font-semibold tracking-[0.16em] uppercase"
          style={{ color: "rgba(132,204,22,0.42)" }}
        >
          {dateStr}
        </span>
      </div>

      {/* Gym name */}
      <h1
        className="relative leading-[0.88] mb-5"
        style={{
          fontFamily: "var(--font-barlow)",
          fontWeight: 800,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          fontSize: "clamp(3rem, 6.5vw, 5.5rem)",
          background: "linear-gradient(130deg, #3f3f46 0%, #84cc16 22%, #ecfccb 42%, #4d7c0f 62%, #a3e635 82%, #84cc16 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 20px rgba(132,204,22,0.25))",
        }}
      >
        {gymName}
      </h1>

      {/* Divider */}
      <div
        className="relative mb-5 mx-auto"
        style={{
          width: 40,
          height: 1,
          background: "linear-gradient(90deg, transparent, #84cc16, #65a30d, transparent)",
        }}
      />

      {/* Tagline */}
      <div className="relative mb-8">
        <p
          className="mb-1"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 600,
            fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)",
            letterSpacing: "0.01em",
            color: "rgba(217,249,157,0.75)",
          }}
        >
          Your training, quantified.
        </p>
        <p
          style={{
            fontSize: "0.78rem",
            lineHeight: 1.6,
            color: "rgba(132,204,22,0.40)",
            letterSpacing: "0.01em",
          }}
        >
          Performance data for athletes who take it seriously.
        </p>
      </div>

      {/* User */}
      <div
        className="relative flex items-center gap-2.5 px-4 py-2 rounded-full"
        style={{ border: "1px solid rgba(132,204,22,0.12)", background: "rgba(132,204,22,0.03)" }}
      >
        <span
          className="text-xs tracking-[0.14em] uppercase"
          style={{ color: "rgba(132,204,22,0.45)" }}
        >
          {userName}
        </span>
      </div>

    </div>
  )
}
