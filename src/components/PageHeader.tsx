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

        <div
          className="mt-10 h-px w-full"
          style={{ backgroundColor: "var(--color-rule-strong)" }}
        />
      </div>
    </header>
  )
}
