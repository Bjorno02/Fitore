import PageHeader from "@/components/PageHeader"

export default function PrivacyPage() {
  return (
    <main>
      <PageHeader
        label="Legal"
        title="Privacy Policy"
        meta="Draft · Rev 00"
      />
      <div className="mx-auto max-w-3xl px-6 pb-24 md:px-12">
        <section
          className="border-t pt-6"
          style={{ borderColor: "var(--color-rule-strong)" }}
        >
          <div
            className="mb-6"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-eyebrow)",
              letterSpacing: "var(--tracking-eyebrow)",
              textTransform: "uppercase",
              color: "var(--color-ink-muted)",
            }}
          >
            <span style={{ color: "var(--color-accent)" }}>[§ 00]</span> Status
          </div>
          <p
            className="max-w-2xl text-lg leading-relaxed"
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--color-ink-soft)",
            }}
          >
            This policy is being drafted. MartialOps collects only the data
            needed to run your training log — sign-in identity via Google, and
            the training sessions and check-ins you enter. We do not sell or
            share your data with third parties. For specifics, reach out at{" "}
            <a
              href="mailto:bshurd42@gmail.com"
              style={{
                color: "var(--color-ink)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
              }}
            >
              bshurd42@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}
