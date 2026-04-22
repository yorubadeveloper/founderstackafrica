import type { Metadata } from "next"
import { fetchAllTools, fetchCategories } from "@/lib/notion"
import { ToolsDirectory } from "@/components/ToolsDirectory"
import Link from "next/link"
import { PHASE_ORDER, PHASE_DESCRIPTIONS } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Startup Tools for African Founders",
  description:
    "Browse curated startup tools for payments, banking, incorporation, hosting, compliance, marketing, and more. Every tool is verified to work across 20+ African countries.",
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

  // Group tools by category
  const toolsByCategory = new Map<string, typeof tools>()
  for (const tool of tools) {
    for (const catId of tool.categoryIds) {
      const existing = toolsByCategory.get(catId) || []
      existing.push(tool)
      toolsByCategory.set(catId, existing)
    }
  }

  // Build phase groups for the client component
  const phases = PHASE_ORDER.map((phase) => {
    const phaseCats = categories.filter((c) => c.phase === phase)
    const catsWithTools = phaseCats
      .map((cat) => ({
        category: cat,
        tools: toolsByCategory.get(cat.id) || [],
      }))
      .filter(({ tools: t }) => t.length > 0)

    return {
      phase,
      description: PHASE_DESCRIPTIONS[phase],
      categories: catsWithTools,
    }
  }).filter((p) => p.categories.length > 0)

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
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-full px-3 py-1.5 shadow-btn transition-all"
              >
                {cat.icon} {cat.name}
                <span className="text-xs text-muted-foreground/60">({count})</span>
              </Link>
            )
          })}
        </div>

        {/* Tools grouped by phase > category (progressive reveal) */}
        <ToolsDirectory phases={phases} />
      </div>

      {/* Submit CTA */}
      <div className="mt-16 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Know a tool we should add?
        </p>
        <Link
          href="/submit"
          className="inline-flex items-center justify-center rounded-full bg-foreground text-background text-sm font-medium h-10 px-5 shadow-btn hover:bg-foreground/90 transition-all"
        >
          Submit a tool
        </Link>
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
