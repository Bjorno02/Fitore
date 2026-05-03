import { DotGrid } from "./Ornaments"

type Props = {
  label: string
  title: string
  meta?: string
}

export default function PageHeader({ label, title, meta }: Props) {
  return (
    <header
      className="frost-enter relative overflow-hidden px-6 pb-10 pt-16 md:px-12 md:pb-14 md:pt-24"
      style={{ color: "var(--color-ink)" }}
    >
      {/* Faint dot texture, top-right corner */}
      <DotGrid
        cols={14}
        rows={6}
        size={2}
        gap={11}
        color="var(--color-ink)"
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          opacity: 0.09,
          pointerEvents: "none",
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Eyebrow row with pulse indicator */}
        <div
          className="mb-6 flex items-center gap-3"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
            textTransform: "uppercase",
            color: "var(--color-ink-muted)",
          }}
        >
          <span aria-hidden="true" className="relative inline-flex h-2 w-2">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
          </span>
          <span>{label}</span>
          {meta && (
            <>
              <span aria-hidden="true" style={{ opacity: 0.5 }}>
                ·
              </span>
              <span style={{ opacity: 0.7 }}>{meta}</span>
            </>
          )}
        </div>

        {/* Accent ribbon — short thick bar before the title */}
        <div
          className="mb-6 h-1.5 w-16"
          style={{
            background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-hover) 100%)`,
            boxShadow: "var(--shadow-accent-md)",
          }}
          aria-hidden="true"
        />

        <h1
          className="gradient-text-ink"
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 800,
            fontSize: "var(--text-display-xl)",
            lineHeight: "var(--leading-display)",
            letterSpacing: "var(--tracking-display)",
            textTransform: "uppercase",
            textWrap: "balance",
          }}
        >
          {title}
        </h1>

        {/* Divider: hairline with accent segment on the left */}
        <div className="mt-10 flex items-center gap-0" aria-hidden="true">
          <div
            className="h-px w-32"
            style={{
              background: `linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent) 100%)`,
            }}
          />
          <div
            className="h-px flex-1"
            style={{ backgroundColor: "var(--color-rule-strong)" }}
          />
        </div>
      </div>
    </header>
  )
}
