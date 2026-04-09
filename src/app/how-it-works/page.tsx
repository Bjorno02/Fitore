export default function HowItWorksPage() {
  return (
    <main
      className="flex-1 flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 75% 45% at 4% 96%, rgba(132,204,22,0.07) 0%, transparent 70%)," +
          "linear-gradient(158deg, #353f4f 0%, #3b434d 100%)",
      }}
    >
      {/* Title block */}
      <div className="flex flex-col items-center pt-16 pb-14 px-6">
        <h1
          style={{
            fontFamily: "var(--font-barlow)",
            fontWeight: 800,
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#dde8f5",
            lineHeight: 0.9,
            marginBottom: "1.75rem",
          }}
        >
          How It Works
        </h1>

        {/* Wide neon underline — same glow as hero bar, but full-width */}
        <div
          style={{
            width: "min(520px, 65vw)",
            height: 3,
            borderRadius: 999,
            background: "linear-gradient(90deg, transparent, #84cc16, #a3e635, #84cc16, transparent)",
            boxShadow:
              "0 0 10px rgba(132,204,22,0.88), 0 0 28px rgba(132,204,22,0.48), 0 0 60px rgba(132,204,22,0.20)",
          }}
        />
      </div>

      {/* Two-column content */}
      <div
        className="flex-1 flex items-stretch w-full mx-auto pb-16"
        style={{ maxWidth: 1040 }}
      >
        {/* Left — Readiness */}
        <div className="flex-1 flex flex-col px-12 pt-2 pb-8">
          <h2
            className="mb-5"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#84cc16",
            }}
          >
            Readiness Score
          </h2>

          <p className="text-sm" style={{ color: "rgba(148,163,184,0.75)", lineHeight: 1.75 }}>
            Readiness is an extraordinarily simple metric. If you have ever attended a school or received a report
            card, you'll find that you can understand it. You simply input your sleep, soreness, and stress (and
            check the injury box if you're hurt), and a score between 1–100 is generated. A score of 100 means you
            are at peak form and perhaps could even chin Francis Ngannou. A score of 1 means you probably need to
            completely change your life and habits before you become victim to a decaying body.
          </p>

          <div className="mt-auto pt-6">
            <div style={{ borderTop: "1px solid rgba(132,204,22,0.12)", paddingTop: "1rem" }}>
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "rgba(132,204,22,0.40)" }}
              >
                TL;DR —{" "}
              </span>
              <span className="text-xs font-semibold" style={{ color: "rgba(132,204,22,0.82)" }}>
                100 means ready for war. 1 means call your doctor.
              </span>
            </div>
          </div>
        </div>

        {/* Vertical neon divider */}
        <div
          style={{
            flexShrink: 0,
            width: 2,
            alignSelf: "stretch",
            borderRadius: 999,
            background:
              "linear-gradient(180deg, transparent 0%, #84cc16 12%, #a3e635 50%, #84cc16 88%, transparent 100%)",
            boxShadow:
              "0 0 10px rgba(132,204,22,0.88), 0 0 28px rgba(132,204,22,0.48), 0 0 60px rgba(132,204,22,0.20)",
          }}
        />

        {/* Right — Training Load */}
        <div className="flex-1 flex flex-col px-12 pt-2 pb-8">
          <h2
            className="mb-5"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#84cc16",
            }}
          >
            Training Load
          </h2>

          <p className="text-sm" style={{ color: "rgba(148,163,184,0.75)", lineHeight: 1.75 }}>
            Training load is, at its core, also embarrassingly simple to grasp. You log how long you trained, how
            hard it felt on a scale of 1–10, and what type of session it was. The system multiplies these together
            and applies a modifier based on training type — because five rounds of live sparring is not the same as
            five rounds of shadow boxing, and pretending otherwise is how people get hurt. The resulting number is
            your load. No units, no ceiling, just an honest reflection of how much you actually put in.
          </p>

          <div className="mt-auto pt-6">
            <div style={{ borderTop: "1px solid rgba(132,204,22,0.12)", paddingTop: "1rem" }}>
              <span
                className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "rgba(132,204,22,0.40)" }}
              >
                TL;DR —{" "}
              </span>
              <span className="text-xs font-semibold" style={{ color: "rgba(132,204,22,0.82)" }}>
                Big number means you trained hard. Whether that's smart or stupid is on you.
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
