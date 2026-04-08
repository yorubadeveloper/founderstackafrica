import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchFlow, fetchFlows } from "@/lib/notion"
import { FlowStep } from "@/components/FlowStep"
import { FlowCard } from "@/components/FlowCard"
import { CountryChip } from "@/components/CountryChip"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const flow = await fetchFlow(slug)
  if (!flow) return {}

  return {
    title: flow.title,
    description: flow.description,
    openGraph: {
      title: `${flow.title} | FounderStack Africa`,
      description: flow.description,
      url: `https://founderstackafrica.com/flow/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      site: "@founderstackafr",
      creator: "@founderstackafr",
      title: flow.title,
      description: flow.description,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/flow/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  try {
    const flows = await fetchFlows()
    if (flows.length === 0) return [{ slug: "_placeholder" }]
    return flows.map((f) => ({ slug: f.slug }))
  } catch {
    return [{ slug: "_placeholder" }]
  }
}

export default async function FlowPage({ params }: Props) {
  const { slug } = await params
  const flow = await fetchFlow(slug)
  if (!flow) notFound()

  // Fetch related flows for the strip
  const allFlows = await fetchFlows()
  const relatedFlows = allFlows
    .filter((f) => f.id !== flow.id)
    .slice(0, 3)

  // Parse steps from rich text (newline-separated numbered steps)
  const steps = flow.steps
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s.replace(/^\d+\.\s*/, ""))

  return (
    <>
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-3">
              {flow.emoji && (
                <span className="text-4xl md:text-5xl leading-none">{flow.emoji}</span>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
                  {flow.title}
                </h1>
              </div>
            </div>
            <div className="mb-3">
              <CountryChip code={flow.country} />
            </div>
            <p className="text-base text-muted-foreground">{flow.description}</p>
          </div>

          <div className="space-y-6">
            {steps.map((step, i) => (
              <FlowStep key={i} stepNumber={i + 1} text={step} />
            ))}
          </div>
        </div>
      </section>

      {/* Related flows */}
      {relatedFlows.length > 0 && (
        <section className="section-alt py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
              More guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
              {relatedFlows.map((f) => (
                <FlowCard key={f.id} flow={f} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* JSON-LD HowTo */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: flow.title,
            description: flow.description,
            step: steps.map((text, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              text,
            })),
          }),
        }}
      />
    </>
  )
}
