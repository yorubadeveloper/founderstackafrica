import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  fetchCategoryBySlug,
  fetchToolsByCategory,
  fetchCategories,
} from "@/lib/notion"
import { CategoryPageClient } from "./client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await fetchCategoryBySlug(slug)
  if (!category) return {}

  return {
    title: `${category.name} Tools for African Startups`,
    description: `${category.description} Curated tools that work across 20+ African countries.`,
    openGraph: {
      title: `${category.name} Tools for African Startups | FounderStack Africa`,
      description: `${category.description} Curated tools that work across 20+ African countries.`,
      url: `https://founderstackafrica.com/category/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      site: "@founderstackafr",
      creator: "@founderstackafr",
      title: `${category.name} Tools for African Startups`,
      description: category.description,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/category/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  try {
    const categories = await fetchCategories()
    if (categories.length === 0) return [{ slug: "_placeholder" }]
    return categories.map((c) => ({ slug: c.slug }))
  } catch {
    return [{ slug: "_placeholder" }]
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await fetchCategoryBySlug(slug)
  if (!category) notFound()

  const tools = await fetchToolsByCategory(category.id)

  return (
    <>
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{category.icon}</span>
              <h1 className="text-3xl sm:text-4xl font-semibold text-foreground">
                {category.name}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">{category.tagline}</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              {category.description}
            </p>
          </div>

          <CategoryPageClient tools={tools} />

          <div className="flex justify-center mt-12">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-6 shadow-btn text-muted-foreground hover:text-foreground transition-all"
            >
              All tools
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${category.name} Tools`,
            itemListElement: tools.map((tool, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: tool.name,
              url: tool.url,
            })),
          }),
        }}
      />
    </>
  )
}
