import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchToolsByCountry, fetchCategories } from "@/lib/notion"
import { ToolCard } from "@/components/ToolCard"
import { COUNTRY_NAMES, COUNTRY_FLAGS, ALL_COUNTRY_CODES } from "@/lib/constants"
import { ShareButton } from "@/components/ShareButton"

interface Props {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const name = COUNTRY_NAMES[code]
  if (!name) return {}

  return {
    title: `Best Startup Tools for ${name}`,
    description: `Curated startup tools verified to work in ${name}. Browse payments, banking, hosting, compliance, incorporation, and marketing tools for ${name}-based founders.`,
    openGraph: {
      title: `Best Startup Tools for ${name} | FounderStack Africa`,
      description: `Curated startup tools verified to work in ${name}. Payments, banking, hosting, compliance, and more.`,
      url: `https://founderstackafrica.com/country/${code}`,
    },
    twitter: {
      card: "summary_large_image",
      site: "@founderstackafr",
      creator: "@founderstackafr",
      title: `Best Startup Tools for ${name}`,
      description: `Curated startup tools verified to work in ${name}. Payments, banking, hosting, and more.`,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/country/${code}`,
    },
  }
}

export function generateStaticParams() {
  return ALL_COUNTRY_CODES.map((code) => ({ code }))
}

export default async function CountryPage({ params }: Props) {
  const { code } = await params

  if (!ALL_COUNTRY_CODES.includes(code as never)) notFound()

  const name = COUNTRY_NAMES[code]
  const flag = COUNTRY_FLAGS[code] || ""

  const [tools, categories] = await Promise.all([
    fetchToolsByCountry(code),
    fetchCategories(),
  ])

  // Group tools by category
  const categoryMap = new Map(categories.map((c) => [c.id, c]))
  const toolsByCategory: Record<string, typeof tools> = {}
  for (const tool of tools) {
    for (const catId of tool.categoryIds) {
      const catName = categoryMap.get(catId)?.name || "Other"
      if (!toolsByCategory[catName]) toolsByCategory[catName] = []
      toolsByCategory[catName].push(tool)
    }
  }

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
              {flag} The {name} Founder Stack
            </h1>
            <ShareButton title={`Best Startup Tools for ${name}`} />
          </div>
          <p className="text-lg text-muted-foreground">
            Tools verified to work in {name}
          </p>
        </div>

        {Object.entries(toolsByCategory).map(([catName, catTools]) => (
          <div key={catName} className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {catName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {catTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}

        {tools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No tools verified for {name} yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
