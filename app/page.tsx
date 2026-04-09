import type { Metadata } from "next"
import { HeroSection } from "@/components/HeroSection"
import { CategoryCard } from "@/components/CategoryCard"
import { ToolMarquee } from "@/components/ToolMarquee"
import {
  fetchCategories,
  fetchAllTools,
} from "@/lib/notion"
import { PHASE_ORDER, PHASE_DESCRIPTIONS } from "@/lib/constants"
import type { Phase } from "@/lib/types"

export const metadata: Metadata = {
  title: "FounderStack Africa | Startup Tools, Guides & Startups for African Founders",
  description:
    "Find the right startup tools, discover African startups, and follow step-by-step guides for payments, incorporation, banking, hosting, and more. Built for founders across 20+ African countries.",
  openGraph: {
    title: "FounderStack Africa | Startup Tools, Guides & Startups for African Founders",
    description:
      "Find the right startup tools, discover African startups, and follow proven guides for payments, incorporation, banking, and more across African markets.",
    url: "https://founderstackafrica.com",
  },
  alternates: {
    canonical: "https://founderstackafrica.com",
  },
}

export default async function Home() {
  const [categories, allTools] = await Promise.all([
    fetchCategories(),
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
      {/* Hero */}
      <HeroSection />

      {/* Tool marquee — 3 rows */}
      {allTools.length > 0 && (
        <section className="bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ToolMarquee tools={allTools} categories={categories} />
          </div>
        </section>
      )}

      {/* Categories */}
      <section id="categories" className="bg-background py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {PHASE_ORDER.map((phase) => {
            const phaseCats = categoriesByPhase[phase]
            if (!phaseCats || phaseCats.length === 0) return null
            return (
              <div key={phase} className="mb-10 last:mb-0">
                <div className="mb-4">
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {phase}
                  </h2>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {PHASE_DESCRIPTIONS[phase]}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
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
              "Find startup tools, discover African startups, and follow step-by-step guides for payments, incorporation, banking, hosting, and compliance across 20+ African countries.",
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
              "The startup resource hub for African founders. Curated tools, startups, and step-by-step guides for payments, incorporation, banking, hosting, and more across African markets.",
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
            name: "FounderStack Africa - Startup Tools, Guides & African Startups",
            description:
              "Browse curated startup tools across payments, banking, incorporation, hosting, compliance, and more. Discover African startups by sector, stage, and country. Follow step-by-step guides built for founders across 20+ African countries.",
            url: "https://founderstackafrica.com",
            isPartOf: {
              "@type": "WebSite",
              name: "FounderStack Africa",
              url: "https://founderstackafrica.com",
            },
            about: {
              "@type": "Thing",
              name: "Startup tools, African startups, and founder guides for African markets",
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
