import { type ReactNode } from "react"
import { DotGrid, DoubleHeadedEagle } from "@/components/Ornaments"

type WarmVariant = {
  id: string
  name: string
  note: string
  canvas: string
  canvasPale: string
  ink: string
  inkSoft: string
  inkMuted: string
  inkFaint: string
  accent: string
  stain1: string
  stain2: string
  inkHint: string
}

function meshBg(v: WarmVariant): string {
  return `
    radial-gradient(ellipse 100% 65% at 50% 0%, ${v.canvasPale} 0%, transparent 55%),
    radial-gradient(ellipse 70% 60% at 12% 22%, ${v.stain1} 0%, transparent 58%),
    radial-gradient(ellipse 58% 58% at 88% 32%, ${v.stain2} 0%, transparent 62%),
    radial-gradient(ellipse 50% 45% at 88% 90%, ${v.inkHint} 0%, transparent 60%),
    radial-gradient(ellipse 36% 34% at 7% 78%, ${v.inkHint} 0%, transparent 60%),
    ${v.canvas}
  `
}

const variants: WarmVariant[] = [
  {
    id: "W4",
    name: "W4 Plain (reference)",
    note: "Original W4 baseline. Stains: tan + soft gold. Mahogany hint in corners.",
    canvas: "#f2e8d5",
    canvasPale: "rgba(247, 240, 224, 0.95)",
    ink: "#4d1e14",
    inkSoft: "#6e2d1f",
    inkMuted: "#846053",
    inkFaint: "#b5968a",
    accent: "#c75622",
    stain1: "rgba(196, 175, 146, 0.4)",
    stain2: "rgba(206, 168, 102, 0.35)",
    inkHint: "rgba(77, 30, 20, 0.28)",
  },
  {
    id: "W4.B",
    name: "Subtle Orange/Gold Boost",
    note: "Stain 1 shifts toward warm tan-orange (visible but quiet). Gold stain deepens. Adds a third soft burnt-orange stain on the lower-left.",
    canvas: "#f2e8d5",
    canvasPale: "rgba(247, 240, 224, 0.95)",
    ink: "#4d1e14",
    inkSoft: "#6e2d1f",
    inkMuted: "#846053",
    inkFaint: "#b5968a",
    accent: "#c75622",
    stain1: "rgba(214, 164, 110, 0.45)",
    stain2: "rgba(214, 168, 86, 0.46)",
    inkHint: "rgba(199, 86, 34, 0.22)",
  },
  {
    id: "W4.C",
    name: "Medium Orange/Gold Boost",
    note: "Clearly warmer mesh — gold is noticeably present on the right, warm orange on the upper-left. Corner hints still mahogany for anchor weight.",
    canvas: "#f2e8d5",
    canvasPale: "rgba(250, 241, 220, 0.95)",
    ink: "#4d1e14",
    inkSoft: "#6e2d1f",
    inkMuted: "#846053",
    inkFaint: "#b5968a",
    accent: "#c75622",
    stain1: "rgba(216, 152, 94, 0.52)",
    stain2: "rgba(218, 160, 70, 0.55)",
    inkHint: "rgba(199, 86, 34, 0.3)",
  },
  {
    id: "W4.D",
    name: "Bold Orange/Gold (sunset glow)",
    note: "Mesh reads as warm sunset — orange-gold glows in the upper area, rich amber stain lower. Might be too much for daily app use but gorgeous on marketing pages.",
    canvas: "#f2e8d5",
    canvasPale: "rgba(252, 242, 214, 0.95)",
    ink: "#4d1e14",
    inkSoft: "#6e2d1f",
    inkMuted: "#846053",
    inkFaint: "#b5968a",
    accent: "#c75622",
    stain1: "rgba(222, 140, 68, 0.6)",
    stain2: "rgba(226, 160, 50, 0.62)",
    inkHint: "rgba(199, 86, 34, 0.38)",
  },
]

function HeroMock({ v }: { v: WarmVariant }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: meshBg(v),
        color: v.ink,
      }}
    >
      {/* Faint eagle backdrop */}
      <div
        className="pointer-events-none absolute hidden lg:block"
        style={{ top: "18%", right: "4%", opacity: 0.06 }}
        aria-hidden="true"
      >
        <DoubleHeadedEagle size={240} color={v.ink} />
      </div>

      {/* Dot grid */}
      <DotGrid
        cols={14}
        rows={6}
        size={2}
        gap={11}
        color={v.ink}
        style={{
          position: "absolute",
          bottom: 60,
          left: 40,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-8 py-24 md:px-12 md:py-32">
        {/* Variant header */}
        <div
          className="mb-12 flex flex-wrap items-baseline justify-between gap-3 border-b pb-4"
          style={{
            borderColor: `${v.ink}28`,
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
            canvas {v.canvas} · ink {v.ink} · accent {v.accent}
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
          <span>Warm Mode Preview</span>
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
            <span style={{ color: v.accent }}>.</span>
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
          <em style={{ color: v.ink }}>Two numbers, no noise.</em>
        </p>

        {/* CTA */}
        <div className="mt-12 flex items-center gap-6">
          <button
            className="group inline-flex items-center gap-3 px-6 py-3 transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: v.accent,
              color: v.canvas,
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
        </div>

        {/* Bottom meta strip */}
        <div
          className="mt-16 flex flex-wrap items-center gap-6 border-t pt-6"
          style={{
            borderColor: `${v.ink}28`,
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

export default function WarmModeLab() {
  return (
    <main>
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
        <span>Fitore · Warm Mode Lab</span>
        <span style={{ opacity: 0.6 }}>10 variants · Pair with Glacial Sky</span>
      </div>

      {variants.map((v) => (
        <HeroMock key={v.id} v={v} />
      ))}

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
