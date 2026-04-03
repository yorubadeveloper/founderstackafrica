import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchToolsByCountry, fetchCategories } from "@/lib/notion"
import { ToolCard } from "@/components/ToolCard"
import { COUNTRY_NAMES, COUNTRY_FLAGS } from "@/lib/constants"

interface Props {
  params: Promise<{ code: string }>
}

const VALID_CODES = ["NG", "GH", "KE", "ZA", "EG", "RW"]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const name = COUNTRY_NAMES[code]
  if (!name) return {}

  return {
    title: `Startup Tools for ${name}`,
    description: `Tools verified to work in ${name}. Payments, banking, hosting, and more. Curated for African startup founders.`,
    openGraph: {
      title: `Startup Tools for ${name} | FounderStack Africa`,
      description: `Tools verified to work in ${name}. Curated for African startup founders.`,
      url: `https://founderstackafrica.com/country/${code}`,
    },
    twitter: {
      card: "summary_large_image",
      site: "@founderstackafr",
      creator: "@founderstackafr",
      title: `Startup Tools for ${name}`,
      description: `Tools verified to work in ${name}.`,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/country/${code}`,
    },
  }
}

export function generateStaticParams() {
  return VALID_CODES.map((code) => ({ code }))
}

export default async function CountryPage({ params }: Props) {
  const { code } = await params

  if (!VALID_CODES.includes(code)) notFound()

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
    const catName = categoryMap.get(tool.categoryId)?.name || "Other"
    if (!toolsByCategory[catName]) toolsByCategory[catName] = []
    toolsByCategory[catName].push(tool)
  }

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-2">
            {flag} The {name} Founder Stack
          </h1>
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
