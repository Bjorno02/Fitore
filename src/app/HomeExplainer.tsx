export default function HomeExplainer() {
  return (
    <div className="w-full frost-enter-2" style={{ maxWidth: 960 }}>
      <p
        className="frost-label justify-center mb-5"
        style={{ color: "rgba(132,204,22,0.55)" }}
      >
        How it works
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div
          className="frost-card rounded-2xl overflow-hidden"
          style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
        >
          <div className="frost-card-header px-5 py-3">
            <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>Readiness Score</p>
          </div>
          <div className="px-5 py-4 flex flex-col">
            <p className="text-sm" style={{ color: "rgba(148,163,184,0.75)", lineHeight: 1.7 }}>
              Readiness is an extraordinarily simple metric. If you have ever attended a school or received a report
              card, you'll find that you can understand it. You simply input your sleep, soreness, and stress (and
              check the injury box if you're hurt), and a score between 1–100 is generated. A score of 100 means you
              are at peak form and perhaps could even chin Francis Ngannou. A score of 1 means you probably need to
              completely change your life and habits before you become victim to a decaying body.
            </p>
            <div className="mt-4 pt-3.5" style={{ borderTop: "1px solid rgba(132,204,22,0.12)" }}>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(132,204,22,0.40)" }}>TL;DR — </span>
              <span className="text-xs font-semibold" style={{ color: "rgba(132,204,22,0.80)" }}>
                100 means ready for war. 1 means call your doctor.
              </span>
            </div>
          </div>
        </div>

        <div
          className="frost-card rounded-2xl overflow-hidden"
          style={{ borderTop: "1px solid rgba(132,204,22,0.22)" }}
        >
          <div className="frost-card-header px-5 py-3">
            <p className="frost-label" style={{ color: "rgba(132,204,22,0.78)" }}>Training Load</p>
          </div>
          <div className="px-5 py-4 flex flex-col">
            <p className="text-sm" style={{ color: "rgba(148,163,184,0.75)", lineHeight: 1.7 }}>
              Training load is, at its core, also embarrassingly simple to grasp. You log how long you trained, how
              hard it felt on a scale of 1–10, and what type of session it was. The system multiplies these together
              and applies a modifier based on training type — because five rounds of live sparring is not the same as
              five rounds of shadow boxing, and pretending otherwise is how people get hurt. The resulting number is
              your load. No units, no ceiling, just an honest reflection of how much you actually put in.
            </p>
            <div className="mt-4 pt-3.5" style={{ borderTop: "1px solid rgba(132,204,22,0.12)" }}>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(132,204,22,0.40)" }}>TL;DR — </span>
              <span className="text-xs font-semibold" style={{ color: "rgba(132,204,22,0.80)" }}>
                Big number means you trained hard. Whether that's smart or stupid is on you.
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
