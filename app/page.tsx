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
  title: "FounderStack Africa | Tools That Work in Africa",
  description:
    "Curated tools, startups, and step-by-step guides vetted to work in Nigeria, Ghana, Kenya, and beyond. The decision engine for African startup founders.",
  openGraph: {
    title: "FounderStack Africa | Tools That Work in Africa",
    description:
      "Curated tools, startups, and guides vetted for African markets. The decision engine for African startup founders.",
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
              "Curated tools, startups, and guides vetted to work in Africa. The decision engine for African startup founders.",
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
              "The decision engine for African startup founders. Curated tools, startups, and guides vetted to work in Africa.",
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
              "Browse curated startup tools and companies across payments, banking, incorporation, hosting, and more. Each tool is verified to work in African markets.",
            url: "https://founderstackafrica.com",
            isPartOf: {
              "@type": "WebSite",
              name: "FounderStack Africa",
              url: "https://founderstackafrica.com",
            },
            about: {
              "@type": "Thing",
              name: "Startup tools and companies for African founders",
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
