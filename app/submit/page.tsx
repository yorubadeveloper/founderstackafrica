import type { Metadata } from "next"
import { Suspense } from "react"
import { SubmitForm } from "@/components/SubmitForm"

export const metadata: Metadata = {
  title: "Submit a Tool or Startup",
  description:
    "Know a tool or startup that works for African founders? Submit it for review. We verify every listing for availability across 20+ African countries before publishing.",
  openGraph: {
    title: "Submit a Tool or Startup | FounderStack Africa",
    description:
      "Submit a tool or startup for African founders. We verify every listing across African markets before publishing.",
    url: "https://founderstackafrica.com/submit",
  },
  twitter: {
    card: "summary_large_image",
    site: "@founderstackafr",
    creator: "@founderstackafr",
    title: "Submit a Tool or Startup",
    description:
      "Submit a tool or startup for African founders. We verify every listing before publishing.",
  },
  alternates: {
    canonical: "https://founderstackafrica.com/submit",
  },
}

export default function SubmitPage() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-3">
          Submit a tool or startup
        </h1>
        <p className="text-base text-muted-foreground mb-10 leading-relaxed">
          We curate every listing on FounderStack Africa by hand. Each one is
          verified before it goes live. If you know a tool or startup that should
          be here, let us know.
        </p>

        <Suspense>
          <SubmitForm />
        </Suspense>
      </div>
    </section>
  )
}
