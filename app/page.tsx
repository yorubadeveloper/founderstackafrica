import type { Metadata } from "next"
import { HeroSection } from "@/components/HeroSection"
import { TrustSection } from "@/components/TrustSection"
import { EmailCapture } from "@/components/EmailCapture"
import { CategoryCard } from "@/components/CategoryCard"
import { FlowCard } from "@/components/FlowCard"
import { ToolCard } from "@/components/ToolCard"
import {
  fetchCategories,
  fetchFeaturedTools,
  fetchFlows,
  fetchAllTools,
} from "@/lib/notion"
import { PHASE_ORDER, PHASE_DESCRIPTIONS } from "@/lib/constants"
import type { Phase } from "@/lib/types"

export const metadata: Metadata = {
  title: "FounderStack Africa | Tools That Work in Africa",
  description:
    "Curated tools and step-by-step guides vetted to work in Nigeria, Ghana, and Kenya. Payments, banking, incorporation, hosting, and more. The decision engine for African startup founders.",
  openGraph: {
    title: "FounderStack Africa | Tools That Work in Africa",
    description:
      "Curated tools and step-by-step guides vetted to work in Nigeria, Ghana, and Kenya. The decision engine for African startup founders.",
    url: "https://founderstackafrica.com",
  },
  alternates: {
    canonical: "https://founderstackafrica.com",
  },
}

export default async function Home() {
  const [categories, featuredTools, flows, allTools] = await Promise.all([
    fetchCategories(),
    fetchFeaturedTools(),
    fetchFlows(),
    fetchAllTools(),
  ])

  // Compute tool counts per category
  const toolCountMap: Record<string, number> = {}
  for (const tool of allTools) {
    toolCountMap[tool.categoryId] = (toolCountMap[tool.categoryId] || 0) + 1
  }

  // Group categories by phase
  const categoriesByPhase = PHASE_ORDER.reduce<Record<Phase, typeof categories>>(
    (acc, phase) => {
      acc[phase] = categories.filter((c) => c.phase === phase)
      return acc
    },
    {} as Record<Phase, typeof categories>
  )

  return (
    <>
      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Founder Flows */}
      {flows.length > 0 && (
        <section id="flows" className="bg-muted/30 py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
              Step-by-step
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-8">
              Founder flows
            </h2>
            <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory pb-4 -mb-4 scrollbar-hide">
              {flows.slice(0, 4).map((flow) => (
                <FlowCard key={flow.id} flow={flow} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Category grid */}
      <section id="categories" className="bg-background py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Categories
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-12">
            Browse the stack
          </h2>
          {PHASE_ORDER.map((phase) => {
            const phaseCats = categoriesByPhase[phase]
            if (!phaseCats || phaseCats.length === 0) return null
            return (
              <div key={phase} className="mb-10">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {phase}
                  </h3>
                  <p className="text-xs text-muted-foreground/60">
                    {PHASE_DESCRIPTIONS[phase]}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                  {phaseCats.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      category={cat}
                      toolCount={toolCountMap[cat.id]}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Featured tools */}
      {featuredTools.length > 0 && (
        <section className="bg-muted/30 py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
              Hand-picked
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-8">
              Founder picks
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Trust section */}
      <TrustSection />

      {/* 6. Newsletter CTA */}
      <section id="newsletter" className="bg-background py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
            Stay in the loop
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
            New tools and guides, straight to your inbox.
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            No spam. Unsubscribe any time.
          </p>
          <div className="flex justify-center">
            <EmailCapture />
          </div>
        </div>
      </section>

      {/* JSON-LD: WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "FounderStack Africa",
            url: "https://founderstackafrica.com",
            description:
              "Curated tools and step-by-step guides vetted to work in Nigeria, Ghana, and Kenya. The decision engine for African startup founders.",
            inLanguage: "en",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://founderstackafrica.com/?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* JSON-LD: Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "FounderStack Africa",
            url: "https://founderstackafrica.com",
            logo: "https://founderstackafrica.com/logo.png",
            sameAs: [
              "https://x.com/founderstackafr",
            ],
            description:
              "The decision engine for African startup founders. Curated tools and guides vetted to work in Nigeria, Ghana, and Kenya.",
          }),
        }}
      />

      {/* JSON-LD: CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "FounderStack Africa - Tools That Work in Africa",
            description:
              "Browse curated startup tools across payments, banking, incorporation, hosting, and more. Each tool is verified to work in African markets.",
            url: "https://founderstackafrica.com",
            isPartOf: {
              "@type": "WebSite",
              name: "FounderStack Africa",
              url: "https://founderstackafrica.com",
            },
            about: {
              "@type": "Thing",
              name: "Startup tools for African founders",
            },
            audience: {
              "@type": "Audience",
              audienceType: "Startup founders in Africa",
              geographicArea: {
                "@type": "Place",
                name: "Africa",
              },
            },
          }),
        }}
      />
    </>
  )
}
