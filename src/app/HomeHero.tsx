import { GiCrossedSwords } from "react-icons/gi"

const BLOOM: React.CSSProperties = {
  background: "radial-gradient(ellipse 60% 80% at 50% 52%, rgba(132,204,22,0.10) 0%, transparent 70%)",
}

function CornerBrackets() {
  const S = 22, T = 16
  const B = "1.5px solid rgba(132,204,22,0.35)"
  return (
    <>
      <div style={{ position: "absolute", top: T, left: T, width: S, height: S, borderTop: B, borderLeft: B }} />
      <div style={{ position: "absolute", top: T, right: T, width: S, height: S, borderTop: B, borderRight: B }} />
      <div style={{ position: "absolute", bottom: T, left: T, width: S, height: S, borderBottom: B, borderLeft: B }} />
      <div style={{ position: "absolute", bottom: T, right: T, width: S, height: S, borderBottom: B, borderRight: B }} />
    </>
  )
}

function LeftStripes() {
  const stripes = [
    { h: "52%", opacity: 0.60 },
    { h: "74%", opacity: 0.42 },
    { h: "36%", opacity: 0.28 },
  ]
  return (
    <div className="absolute top-0 bottom-0 flex items-center gap-2.5" style={{ left: "calc(50% - 36rem)" }} aria-hidden="true">
      {stripes.map(({ h, opacity }, i) => (
        <div
          key={i}
          style={{
            width: 2,
            height: h,
            borderRadius: 999,
            background: `linear-gradient(180deg, transparent 0%, rgba(132,204,22,${opacity}) 20%, rgba(132,204,22,${opacity}) 80%, transparent 100%)`,
            boxShadow: `0 0 7px rgba(132,204,22,${opacity * 0.55})`,
          }}
        />
      ))}
    </div>
  )
}

function CrossedSwordsIcon() {
  return (
    <div className="absolute top-0 bottom-0 flex items-center" style={{ right: "calc(50% - 38rem)" }} aria-hidden="true">
      <GiCrossedSwords
        size={100}
        style={{
          color: "rgba(132,204,22,0.55)",
          filter: "drop-shadow(0 0 6px rgba(132,204,22,0.50)) drop-shadow(0 0 18px rgba(132,204,22,0.20))",
        }}
      />
    </div>
  )
}

type Props = { gymName: string; userName: string | null | undefined }

export default function HomeHero({ gymName, userName }: Props) {
  const now = new Date()
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })

  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center text-center px-10"
      style={{
        background: "linear-gradient(160deg, #040801 0%, #000000 55%, #020500 100%)",
        borderBottom: "1px solid rgba(132,204,22,0.28)",
        boxShadow: "0 6px 48px rgba(4,10,22,0.45)",
        minHeight: 320,
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={BLOOM} />
      <CornerBrackets />
      <LeftStripes />
      <CrossedSwordsIcon />

      {/* Glowing accent bar */}
      <div
        className="relative mb-2 frost-enter"
        style={{
          width: 100,
          height: 3,
          borderRadius: 999,
          background: "linear-gradient(90deg, transparent, #84cc16, #a3e635, #84cc16, transparent)",
          boxShadow: "0 0 10px rgba(132,204,22,0.85), 0 0 28px rgba(132,204,22,0.45), 0 0 56px rgba(132,204,22,0.18)",
        }}
      />

      {/* Gym name — animated sweep */}
      <h1
        className="wordmark-frost relative mb-4 frost-enter"
        style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", letterSpacing: "0.06em" }}
      >
        {gymName}
      </h1>

      {/* Tagline */}
      <p
        className="relative mb-8 frost-enter-2"
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(132,204,22,0.35)",
        }}
      >
        Your Training · Quantified
      </p>

      {/* Status pill */}
      <div
        className="relative flex items-center gap-5 px-5 py-2 frost-enter-2"
        style={{
          border: "1px solid rgba(132,204,22,0.13)",
          borderRadius: 999,
          background: "rgba(132,204,22,0.025)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: "#84cc16", boxShadow: "0 0 7px rgba(132,204,22,0.95)" }}
          />
          <span className="text-xs tracking-[0.13em] uppercase" style={{ color: "rgba(132,204,22,0.38)" }}>
            {dateStr}
          </span>
        </div>
        <div style={{ width: 1, height: 11, background: "rgba(132,204,22,0.16)" }} />
        <span className="text-xs tracking-[0.13em] uppercase" style={{ color: "rgba(132,204,22,0.38)" }}>
          {userName}
        </span>
      </div>

    </div>
  )
}
