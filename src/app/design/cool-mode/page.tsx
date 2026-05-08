import { DotGrid, DoubleHeadedEagle } from "@/components/Ornaments"

type CoolVariant = {
  id: string
  name: string
  note: string
  background: string          // full CSS background value for the section
  canvas: string              // solid fallback
  ink: string                 // primary text
  inkSoft: string             // body text
  inkMuted: string            // eyebrow/meta text
  inkFaint: string            // very soft
  accent: string              // cta / period color
  accentBright?: string       // for dark-mode pops
  rule: string                // hairline border
  dotColor: string            // decorative dot color
  mode: "light" | "dark"
}

// Base mesh helper — same structure used for all spins, only colors vary
function meshBg(
  canvas: string,
  spotlight: string,
  stain1: string,
  stain2: string,
  stain3: string,
  inkHint: string,
) {
  return `
    radial-gradient(ellipse 80% 60% at 50% 0%, ${spotlight} 0%, transparent 55%),
    radial-gradient(ellipse 60% 60% at 12% 22%, ${stain1} 0%, transparent 60%),
    radial-gradient(ellipse 55% 55% at 88% 30%, ${stain2} 0%, transparent 62%),
    radial-gradient(ellipse 50% 50% at 50% 82%, ${stain3} 0%, transparent 60%),
    radial-gradient(ellipse 42% 40% at 88% 90%, ${inkHint} 0%, transparent 60%),
    ${canvas}
  `
}

const variants: CoolVariant[] = [
  {
    id: "C2",
    name: "Baseline · Glacial Sky",
    note: "Your pick, unchanged. Dove-slate canvas, midnight ink, sky-blue accent.",
    background: meshBg(
      "#d8dde4",
      "#e8edf2",
      "rgba(148, 163, 184, 0.35)",
      "rgba(56, 189, 248, 0.18)",
      "rgba(71, 85, 105, 0.28)",
      "rgba(15, 23, 42, 0.22)",
    ),
    canvas: "#d8dde4",
    ink: "#0f172a",
    inkSoft: "#1e293b",
    inkMuted: "#475569",
    inkFaint: "#94a3b8",
    accent: "#38bdf8",
    rule: "rgba(15, 23, 42, 0.16)",
    dotColor: "#0f172a",
    mode: "light",
  },
  {
    id: "C2.B",
    name: "Lighter Canvas",
    note: "Δ Canvas → lighter ice-slate. Same ink, same accent. Airier, more daylight.",
    background: meshBg(
      "#e5e9ef",
      "#f1f4f8",
      "rgba(148, 163, 184, 0.28)",
      "rgba(56, 189, 248, 0.15)",
      "rgba(71, 85, 105, 0.2)",
      "rgba(15, 23, 42, 0.18)",
    ),
    canvas: "#e5e9ef",
    ink: "#0f172a",
    inkSoft: "#1e293b",
    inkMuted: "#475569",
    inkFaint: "#94a3b8",
    accent: "#38bdf8",
    rule: "rgba(15, 23, 42, 0.14)",
    dotColor: "#0f172a",
    mode: "light",
  },
  {
    id: "C2.C",
    name: "Deeper Canvas",
    note: "Δ Canvas → deeper cool slate. Dramatic, stormier. Text carries more weight.",
    background: meshBg(
      "#c3c9d3",
      "#d6dbe2",
      "rgba(100, 116, 139, 0.35)",
      "rgba(56, 189, 248, 0.2)",
      "rgba(51, 65, 85, 0.35)",
      "rgba(15, 23, 42, 0.3)",
    ),
    canvas: "#c3c9d3",
    ink: "#0f172a",
    inkSoft: "#1e293b",
    inkMuted: "#334155",
    inkFaint: "#64748b",
    accent: "#38bdf8",
    rule: "rgba(15, 23, 42, 0.2)",
    dotColor: "#0f172a",
    mode: "light",
  },
  {
    id: "C2.D",
    name: "Cobalt Accent",
    note: "Δ Accent → deeper cobalt blue. Saturated, confident. Less icy, more 'imperial navy.'",
    background: meshBg(
      "#d8dde4",
      "#e8edf2",
      "rgba(148, 163, 184, 0.35)",
      "rgba(29, 78, 216, 0.2)",
      "rgba(71, 85, 105, 0.28)",
      "rgba(15, 23, 42, 0.22)",
    ),
    canvas: "#d8dde4",
    ink: "#0f172a",
    inkSoft: "#1e293b",
    inkMuted: "#475569",
    inkFaint: "#94a3b8",
    accent: "#1d4ed8",
    rule: "rgba(15, 23, 42, 0.16)",
    dotColor: "#0f172a",
    mode: "light",
  },
  {
    id: "C2.E",
    name: "Electric Cyan",
    note: "Δ Accent → electric cyan. Colder, brighter, more 'tech future.' Vibrant pop.",
    background: meshBg(
      "#d8dde4",
      "#e8edf2",
      "rgba(148, 163, 184, 0.35)",
      "rgba(6, 182, 212, 0.2)",
      "rgba(71, 85, 105, 0.28)",
      "rgba(15, 23, 42, 0.22)",
    ),
    canvas: "#d8dde4",
    ink: "#0f172a",
    inkSoft: "#1e293b",
    inkMuted: "#475569",
    inkFaint: "#94a3b8",
    accent: "#06b6d4",
    rule: "rgba(15, 23, 42, 0.16)",
    dotColor: "#0f172a",
    mode: "light",
  },
  {
    id: "C2.F",
    name: "Navy Ink Family",
    note: "Δ Ink → deep navy (blue family). Ink + accent now share hue heritage. Single-hue cohesion.",
    background: meshBg(
      "#d8dde4",
      "#e8edf2",
      "rgba(148, 163, 184, 0.35)",
      "rgba(56, 189, 248, 0.18)",
      "rgba(71, 85, 105, 0.28)",
      "rgba(12, 28, 58, 0.24)",
    ),
    canvas: "#d8dde4",
    ink: "#0c1c3a",
    inkSoft: "#1e2f55",
    inkMuted: "#475569",
    inkFaint: "#94a3b8",
    accent: "#38bdf8",
    rule: "rgba(12, 28, 58, 0.18)",
    dotColor: "#0c1c3a",
    mode: "light",
  },
]

function HeroMock({ v }: { v: CoolVariant }) {
  const eagleColor = v.mode === "dark" ? v.ink : v.ink
  const accentDisplay = v.accentBright ?? v.accent
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: v.background,
        color: v.ink,
      }}
    >
      {/* Faint eagle backdrop */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{ top: "18%", right: "4%", opacity: v.mode === "dark" ? 0.1 : 0.07 }}
        aria-hidden="true"
      >
        <DoubleHeadedEagle size={240} color={eagleColor} />
      </div>

      {/* Dot grid */}
      <DotGrid
        cols={14}
        rows={6}
        size={2}
        gap={11}
        color={v.dotColor}
        style={{
          position: "absolute",
          bottom: 60,
          left: 40,
          opacity: v.mode === "dark" ? 0.12 : 0.11,
          pointerEvents: "none",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-8 py-24 md:px-12 md:py-32">
        {/* Variant header */}
        <div
          className="mb-12 flex flex-wrap items-baseline justify-between gap-3 border-b pb-4"
          style={{
            borderColor: v.rule,
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: v.inkMuted,
          }}
        >
          <span>
            <span style={{ color: v.accent }}>[</span>Variant {v.id}
            <span style={{ color: v.accent }}>]</span> — {v.name}
          </span>
          <span className="hidden md:inline" style={{ color: v.inkFaint }}>
            {v.mode === "dark" ? "Dark Mode" : "Light Mode"}
          </span>
        </div>

        {/* Eyebrow */}
        <div
          className="mb-10 flex items-center gap-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: v.inkMuted,
          }}
        >
          <span
            aria-hidden="true"
            className="inline-block"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: v.accent,
              transform: "rotate(45deg)",
            }}
          />
          <span>Cool Mode Preview</span>
        </div>

        {/* Stacked headline */}
        <h2
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 800,
            fontSize: "clamp(56px, 9vw, 128px)",
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            color: v.ink,
          }}
        >
          <div>Train. Track.</div>
          <div>
            Triumph
            <span style={{ color: accentDisplay }}>.</span>
          </div>
        </h2>

        {/* Body paragraph */}
        <p
          className="mt-12 max-w-xl"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "18px",
            lineHeight: 1.7,
            color: v.inkSoft,
          }}
        >
          {v.note}{" "}
          <em style={{ color: v.ink }}>
            Two numbers, no noise.
          </em>
        </p>

        {/* CTA */}
        <div className="mt-12 flex items-center gap-6">
          <button
            className="group inline-flex items-center gap-3 px-6 py-3 transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: v.accent,
              color: v.mode === "dark" ? v.canvas : v.canvas,
              border: `1px solid ${v.accent}`,
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            <span>Start operating</span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>

          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: v.inkMuted,
            }}
          >
            bg {v.canvas} · ink {v.ink} · accent {v.accent}
          </span>
        </div>

        {/* Bottom meta strip — mini index with numbered circles */}
        <div
          className="mt-16 flex flex-wrap items-center gap-6 border-t pt-6"
          style={{
            borderColor: v.rule,
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: v.inkMuted,
          }}
        >
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: v.accent,
                color: v.canvas,
                textAlign: "center",
                lineHeight: "20px",
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "11px",
              }}
            >
              1
            </span>
            Readiness
          </span>
          <span style={{ color: v.inkFaint }}>·</span>
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              style={{
                display: "inline-block",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: v.accent,
                color: v.canvas,
                textAlign: "center",
                lineHeight: "20px",
                fontFamily: "var(--font-barlow)",
                fontWeight: 800,
                fontSize: "11px",
              }}
            >
              2
            </span>
            Load
          </span>
        </div>
      </div>
    </section>
  )
}

export default function CoolModeLab() {
  return (
    <main>
      {/* Header */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between border-b px-8 py-4 backdrop-blur"
        style={{
          borderColor: "var(--color-rule-strong)",
          backgroundColor: "rgba(246, 220, 159, 0.85)",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--color-ink)",
        }}
      >
        <span>Fitore · Cool Mode Lab</span>
        <span style={{ opacity: 0.6 }}>Scroll · Pick a winner</span>
      </div>

      {variants.map((v) => (
        <HeroMock key={v.id} v={v} />
      ))}

      {/* Footer note */}
      <div
        className="px-8 py-12 text-center"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--color-ink-faint)",
        }}
      >
        — End of Lab — Pick a variant ↑
      </div>
    </main>
  )
}
