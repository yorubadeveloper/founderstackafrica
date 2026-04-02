import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Submit a Tool | FounderStack Africa",
  description:
    "Know a tool that works for African founders? Submit it for review.",
  openGraph: {
    title: "Submit a Tool | FounderStack Africa",
    description:
      "Know a tool that works for African founders? Submit it for review.",
    url: "https://founderstackafrica.com/submit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Submit a Tool | FounderStack Africa",
    description: "Know a tool that works for African founders? Submit it for review.",
  },
  alternates: {
    canonical: "https://founderstackafrica.com/submit",
  },
}

export default function SubmitPage() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          Know a tool we&apos;re missing?
        </h1>
        <p className="text-base text-muted-foreground mb-8 leading-relaxed">
          We curate every tool on FounderStack Africa by hand. Each one is
          verified to work in at least one African country before it&apos;s
          listed. If you know a tool that should be here, let us know and
          we&apos;ll review it.
        </p>

        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Send us the tool name, website, and which African countries it works
            in.
          </p>
          <a
            href="mailto:hello@founderstackafrica.com?subject=Tool%20Submission"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-primary/80"
          >
            Submit via email
          </a>
        </div>
      </div>
    </section>
  )
}
