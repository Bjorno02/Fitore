import { type ReactNode } from "react"
import { BlobField } from "@/components/Ornaments"

function MiniHero({ title, note }: { title: string; note: string }) {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-8 py-24 md:px-12 md:py-32">
      <div
        className="mb-8 flex flex-wrap items-baseline gap-4"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-eyebrow)",
          letterSpacing: "var(--tracking-eyebrow)",
          textTransform: "uppercase",
          color: "var(--color-ink-muted)",
        }}
      >
        <span style={{ color: "var(--color-ink)" }}>
          <span style={{ color: "var(--color-accent)" }}>[</span>Variant
          <span style={{ color: "var(--color-accent)" }}>]</span>
        </span>
        <span>—</span>
        <span>{title}</span>
      </div>

      <h2
        style={{
          fontFamily: "var(--font-barlow)",
          fontWeight: 800,
          fontSize: "clamp(48px, 8vw, 104px)",
          lineHeight: 0.88,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: "var(--color-ink)",
        }}
      >
        Train. Track.
        <br />
        Triumph
        <span style={{ color: "var(--color-accent)" }}>.</span>
      </h2>

      <p
        className="mt-8 max-w-xl"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "17px",
          lineHeight: 1.7,
          color: "var(--color-ink-soft)",
        }}
      >
        {note}
      </p>
    </div>
  )
}

function VariantSection({
  name,
  note,
  children,
}: {
  name: string
  note: string
  children: ReactNode
}) {
  return (
    <section
      className="relative overflow-hidden border-b"
      style={{ borderColor: "var(--color-rule-strong)" }}
    >
      {children}
      <MiniHero title={name} note={note} />
    </section>
  )
}

export default function BackgroundLab() {
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
        <span>Fitore · Background Lab</span>
        <span style={{ opacity: 0.6 }}>Scroll · Pick a winner</span>
      </div>

      {/* ─── A · Mesh Gradient Warm ──────────────────────── */}
      <VariantSection
        name="A · Mesh Gradient Warm"
        note="Multiple large radial gradients layered in rose, gold and emerald tones. Stripe-style, soft and atmospheric."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 15% 20%, rgba(200, 154, 138, 0.55) 0%, transparent 60%),
              radial-gradient(ellipse 60% 60% at 85% 30%, rgba(212, 162, 76, 0.45) 0%, transparent 65%),
              radial-gradient(ellipse 50% 50% at 50% 85%, rgba(168, 121, 104, 0.4) 0%, transparent 60%),
              radial-gradient(ellipse 40% 45% at 90% 90%, rgba(5, 150, 105, 0.22) 0%, transparent 60%),
              var(--color-canvas)
            `,
          }}
        />
      </VariantSection>

      {/* ─── B · Fine Grid ────────────────────────────────── */}
      <VariantSection
        name="B · Fine Grid"
        note="24px grid of oxblood hairlines at very low opacity. Linear-docs style — technical, precise, never busy."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundColor: "var(--color-canvas)",
            backgroundImage: `
              linear-gradient(to right, rgba(58, 10, 10, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(58, 10, 10, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
      </VariantSection>

      {/* ─── C · Fine Dots ────────────────────────────────── */}
      <VariantSection
        name="C · Fine Dots"
        note="Uniform dot grid, 24px pitch, oxblood dots at 10% opacity. Vercel-style — clean technical texture."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundColor: "var(--color-canvas)",
            backgroundImage: `radial-gradient(rgba(58, 10, 10, 0.18) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </VariantSection>

      {/* ─── D · Diagonal Stripes ─────────────────────────── */}
      <VariantSection
        name="D · Diagonal Stripes"
        note="45° repeating diagonal hairlines at 6% opacity. Editorial shimmer — think vintage manuscript ruling."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundColor: "var(--color-canvas)",
            backgroundImage: `repeating-linear-gradient(45deg, rgba(58, 10, 10, 0.06) 0px, rgba(58, 10, 10, 0.06) 1px, transparent 1px, transparent 12px)`,
          }}
        />
      </VariantSection>

      {/* ─── E · Pure Grain ───────────────────────────────── */}
      <VariantSection
        name="E · Pure Grain"
        note="Just SVG fractal noise at 15% opacity on flat canvas. OpenAI-blog style — silent, premium, editorial."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: "var(--color-canvas)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0.15,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />
      </VariantSection>

      {/* ─── F · Paper Texture ────────────────────────────── */}
      <VariantSection
        name="F · Paper Texture"
        note="Warm canvas gradient (pale → raised → canvas) layered with grain. Reads like aged editorial paper stock."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, var(--color-canvas-pale) 0%, var(--color-canvas) 50%, var(--color-canvas-inset) 100%)
            `,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0.2,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
          }}
        />
      </VariantSection>

      {/* ─── G · Radial Spotlight ────────────────────────── */}
      <VariantSection
        name="G · Radial Spotlight"
        note="Warm light emanates from upper-center, darkens to edges. Cinematic — think stage lighting, dojo ambiance."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 90% 70% at 50% 10%, var(--color-canvas-pale) 0%, var(--color-canvas) 45%, var(--color-canvas-deep) 120%)
            `,
          }}
        />
      </VariantSection>

      {/* ─── H · Mesh + Grain + Vignette (Maximal) ───────── */}
      <VariantSection
        name="H · Mesh + Grain + Vignette"
        note="Everything layered — warm mesh gradient + grain + subtle edge darkening. Maximum premium, maximum cost."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 15% 20%, rgba(200, 154, 138, 0.5) 0%, transparent 60%),
              radial-gradient(ellipse 60% 60% at 85% 30%, rgba(212, 162, 76, 0.35) 0%, transparent 65%),
              radial-gradient(ellipse 50% 50% at 50% 85%, rgba(168, 121, 104, 0.3) 0%, transparent 60%),
              radial-gradient(ellipse 40% 45% at 90% 90%, rgba(5, 150, 105, 0.18) 0%, transparent 60%),
              radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(58, 10, 10, 0.12) 100%),
              var(--color-canvas)
            `,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0.1,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />
      </VariantSection>

      {/* ─── I · Current SVG Blobs (for comparison) ──────── */}
      <VariantSection
        name="I · Current SVG Blobs (reference)"
        note="The SVG radial blobs currently on /home for direct comparison. Meant to match how it feels right now."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundColor: "var(--color-canvas)" }}
        />
        <BlobField variant="hero" />
      </VariantSection>

      {/* ─── J · Dot Grid + Warm Mesh ────────────────────── */}
      <VariantSection
        name="J · Dot Grid on Paper"
        note="Dot grid layered on the warm paper texture. Technical precision on top of editorial warmth — hybrid move."
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(180deg, var(--color-canvas-pale) 0%, var(--color-canvas) 60%, var(--color-canvas-inset) 100%)
            `,
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(rgba(58, 10, 10, 0.12) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            opacity: 0.12,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />
      </VariantSection>

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
        — End of Lab —
      </div>
    </main>
  )
}
