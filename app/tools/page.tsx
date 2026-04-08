import type { Metadata } from "next"
import { fetchAllTools, fetchCategories } from "@/lib/notion"
import { ToolCard } from "@/components/ToolCard"
import Link from "next/link"
import { PHASE_ORDER, PHASE_DESCRIPTIONS } from "@/lib/constants"
import type { Phase } from "@/lib/types"

export const metadata: Metadata = {
  title: "Startup Tools for African Founders",
  description:
    "Browse curated startup tools for payments, banking, incorporation, hosting, compliance, marketing, and more. Every tool is verified to work in Nigeria, Ghana, Kenya, South Africa, Egypt, or Rwanda.",
  openGraph: {
    title: "Startup Tools for African Founders | FounderStack Africa",
    description:
      "Browse curated startup tools for payments, banking, incorporation, hosting, compliance, and more. Verified for African markets.",
    url: "https://founderstackafrica.com/tools",
  },
  alternates: {
    canonical: "https://founderstackafrica.com/tools",
  },
}

export default async function ToolsPage() {
  const [tools, categories] = await Promise.all([
    fetchAllTools(),
    fetchCategories(),
  ])

  // Build category lookup
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  // Group tools by category
  const toolsByCategory = new Map<string, typeof tools>()
  for (const tool of tools) {
    const existing = toolsByCategory.get(tool.categoryId) || []
    existing.push(tool)
    toolsByCategory.set(tool.categoryId, existing)
  }

  // Group categories by phase for organized display
  const categoriesByPhase = PHASE_ORDER.reduce<Record<Phase, typeof categories>>(
    (acc, phase) => {
      acc[phase] = categories.filter((c) => c.phase === phase)
      return acc
    },
    {} as Record<Phase, typeof categories>
  )

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Directory
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            All tools
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            {tools.length} tools vetted for African founders. Browse by category below.
          </p>
        </div>

        {/* Category quick-nav */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => {
            const count = toolsByCategory.get(cat.id)?.length || 0
            return (
              <a
                key={cat.id}
                href={`#cat-${cat.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg px-3 py-1.5 shadow-btn transition-all"
              >
                {cat.icon} {cat.name}
                <span className="text-xs text-muted-foreground/60">({count})</span>
              </a>
            )
          })}
        </div>

        {/* Tools grouped by phase > category */}
        {PHASE_ORDER.map((phase) => {
          const phaseCats = categoriesByPhase[phase]
          if (!phaseCats || phaseCats.length === 0) return null

          const phaseHasTools = phaseCats.some(
            (cat) => (toolsByCategory.get(cat.id)?.length || 0) > 0
          )
          if (!phaseHasTools) return null

          return (
            <div key={phase} className="mb-16">
              <div className="mb-6">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {phase}
                </h2>
                <p className="text-xs text-muted-foreground/60">
                  {PHASE_DESCRIPTIONS[phase]}
                </p>
              </div>

              {phaseCats.map((cat) => {
                const catTools = toolsByCategory.get(cat.id)
                if (!catTools || catTools.length === 0) return null

                return (
                  <div key={cat.id} id={`cat-${cat.slug}`} className="mb-10 scroll-mt-20">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-medium text-foreground">
                        {cat.icon} {cat.name}
                      </h3>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        View category &rarr;
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* JSON-LD: ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Startup Tools for African Founders",
            description:
              "Curated directory of startup tools for payments, banking, incorporation, hosting, compliance, marketing, and more across African markets.",
            numberOfItems: tools.length,
            itemListElement: tools.slice(0, 50).map((tool, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: tool.name,
              url: `https://founderstackafrica.com/tool/${tool.slug}`,
            })),
          }),
        }}
      />
    </section>
  )
}
