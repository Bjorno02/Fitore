type Variant = {
  id: string;
  name: string;
  note: string;
  changed: string;
  bg: string;
  ink: string;
  accent: string;
  muted: string;
  eyebrow: string;
  secondary?: string;
};

const variants: Variant[] = [
  {
    id: "W0",
    name: "Butter · Baseline (cool)",
    note: "Your current 1H.G1 bg. Slight green bias in the yellow. Crisp, a bit cool.",
    changed: "reference",
    bg: "#fdf5d9",
    ink: "#3a0a0a",
    accent: "#059669",
    muted: "#78716c",
    eyebrow: "#78716c",
  },
  {
    id: "W1",
    name: "Butter · Subtle Warm",
    note: "A small nudge toward orange in the yellow. Still clearly 'butter,' just less cool. Safest step up in warmth.",
    changed: "bg: #fdf5d9 → #fcefc8",
    bg: "#fcefc8",
    ink: "#3a0a0a",
    accent: "#059669",
    muted: "#78716c",
    eyebrow: "#78716c",
  },
  {
    id: "W2",
    name: "Butter · Rich Warm",
    note: "Clearly warmer — enters 'cream butter / French pastry' territory. More personality. Still a background, not a statement.",
    changed: "bg: → #fae7b5",
    bg: "#fae7b5",
    ink: "#3a0a0a",
    accent: "#059669",
    muted: "#78716c",
    eyebrow: "#78716c",
  },
  {
    id: "W3",
    name: "Butter · Honey Cream",
    note: "Pushes into honey territory. Becomes distinctly warm — now reads 'kraft paper / natural-wine label.' Bolder brand move.",
    changed: "bg: → #f6dc9f",
    bg: "#f6dc9f",
    ink: "#3a0a0a",
    accent: "#059669",
    muted: "#78716c",
    eyebrow: "#78716c",
  },
];

function HeroMock({ v }: { v: Variant }) {
  const rule = `1px solid ${v.ink}`;
  return (
    <section
      className="px-8 py-24 md:px-20 md:py-36"
      style={{ backgroundColor: v.bg, color: v.ink }}
    >
      <div
        className="mx-auto max-w-6xl"
        style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
      >
        <div
          className="mb-8 flex flex-col gap-3 border-b pb-6 text-[11px] uppercase tracking-[0.25em]"
          style={{ borderColor: v.ink, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
        >
          <div className="flex items-baseline justify-between">
            <span style={{ color: v.eyebrow }}>
              Variant {v.id} — {v.name}
            </span>
            <span className="hidden md:inline" style={{ color: v.muted }}>
              Δ {v.changed}
            </span>
          </div>
          <span className="normal-case tracking-normal" style={{ color: v.muted, fontFamily: "var(--font-jakarta), sans-serif" }}>
            {v.note}
          </span>
        </div>

        <div
          className="mb-10 text-[11px] uppercase tracking-[0.35em]"
          style={{ color: v.eyebrow, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
        >
          001 · Combat Ops
        </div>

        <h1
          className="font-extrabold uppercase"
          style={{
            fontFamily: "var(--font-barlow), sans-serif",
            fontSize: "clamp(72px, 13vw, 180px)",
            lineHeight: 0.82,
            letterSpacing: "-0.02em",
          }}
        >
          <div>Train.</div>
          <div>Track.</div>
          <div>
            Triumph
            <span style={{ color: v.accent }}>.</span>
          </div>
        </h1>

        <p
          className="mt-14 max-w-xl text-lg leading-relaxed"
          style={{ color: v.muted }}
        >
          The operating system for combat sports gyms. Attendance, sessions, memberships — without the chaos of spreadsheets.
        </p>

        <div
          className="mt-16 grid grid-cols-3 gap-6 border-t pt-8"
          style={{ borderColor: v.ink }}
        >
          {[
            { value: "2,418", label: "athletes tracked", tint: false },
            { value: "48", label: "sessions / week", tint: true },
            { value: "99.2%", label: "check-in accuracy", tint: false },
          ].map((m) => (
            <div key={m.label}>
              <div
                className="font-bold"
                style={{
                  fontFamily: "var(--font-barlow), sans-serif",
                  fontSize: "clamp(32px, 5vw, 64px)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  color: m.tint && v.secondary ? v.secondary : v.ink,
                }}
              >
                {m.value}
              </div>
              <div
                className="mt-2 text-[11px] uppercase tracking-[0.2em]"
                style={{
                  color: v.muted,
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-6">
          <button
            className="px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-transform hover:-translate-y-0.5"
            style={{
              backgroundColor: v.accent,
              color: v.bg,
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
              border: rule,
            }}
          >
            Start operating →
          </button>
          <a
            className="text-xs uppercase tracking-[0.2em] underline underline-offset-8 opacity-80 hover:opacity-100"
            style={{
              color: v.ink,
              fontFamily: "ui-monospace, SFMono-Regular, monospace",
            }}
          >
            See how it works
          </a>
          <span
            className="ml-auto hidden text-[11px] uppercase tracking-[0.2em] md:inline"
            style={{ color: v.muted, fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
          >
            bg {v.bg} · ink {v.ink} · accent {v.accent}
          </span>
        </div>
      </div>
    </section>
  );
}

export default function PalettePlayground() {
  return (
    <main className="relative isolate">
      <div
        className="sticky top-0 z-50 flex items-center justify-between border-b border-black/10 bg-white/80 px-8 py-4 backdrop-blur"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
      >
        <div className="text-xs uppercase tracking-[0.3em]">MartialOps · Palette Lab</div>
        <div className="text-[11px] uppercase tracking-[0.25em] opacity-60">
          Scroll through 5 variants
        </div>
      </div>
      {variants.map((v) => (
        <HeroMock key={v.id} v={v} />
      ))}
      <footer
        className="bg-black py-24 text-center text-xs uppercase tracking-[0.3em] text-white/80"
        style={{ fontFamily: "ui-monospace, SFMono-Regular, monospace" }}
      >
        End of palette lab · pick a variant ↑
      </footer>
    </main>
  );
}
