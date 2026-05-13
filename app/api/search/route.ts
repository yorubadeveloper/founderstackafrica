import { NextResponse } from "next/server"
import { fetchAllTools, fetchStartups, fetchFlows, fetchCategories } from "@/lib/notion"

export interface SearchIndexItem {
  type: "tool" | "startup" | "flow" | "category"
  name: string
  slug: string
  emoji: string
  tagline: string
  // optional secondary fields used for fuzzy matching only
  extra?: string
}

// Single lightweight index containing every searchable record.
// Cached upstream by `fetchX` (use cache + cacheTag), so this is cheap.
export async function GET() {
  const [tools, startups, flows, categories] = await Promise.all([
    fetchAllTools(),
    fetchStartups(),
    fetchFlows(),
    fetchCategories(),
  ])

  const items: SearchIndexItem[] = [
    ...tools.map((t) => ({
      type: "tool" as const,
      name: t.name,
      slug: t.slug,
      emoji: t.emoji,
      tagline: t.tagline,
      extra: t.categoryName,
    })),
    ...startups.map((s) => ({
      type: "startup" as const,
      name: s.name,
      slug: s.slug,
      emoji: s.emoji,
      tagline: s.tagline,
      extra: s.sector.join(" "),
    })),
    ...flows.map((f) => ({
      type: "flow" as const,
      name: f.title,
      slug: f.slug,
      emoji: f.emoji,
      tagline: f.description,
    })),
    ...categories.map((c) => ({
      type: "category" as const,
      name: c.name,
      slug: c.slug,
      emoji: c.icon,
      tagline: c.tagline,
    })),
  ]

  return NextResponse.json(
    { items },
    {
      headers: {
        // Browser-side cache for an hour; SWR for a day.
        // Tag-based revalidation on the server still applies via the underlying fetchers.
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    },
  )
}
