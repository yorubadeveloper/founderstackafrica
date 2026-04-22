import { NextRequest, NextResponse } from "next/server"
import { fetchAllTools, fetchStartups, fetchFlows, fetchCategories } from "@/lib/notion"

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase().trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ tools: [], startups: [], flows: [], categories: [] })
  }

  const [allTools, allStartups, allFlows, allCategories] = await Promise.all([
    fetchAllTools(),
    fetchStartups(),
    fetchFlows(),
    fetchCategories(),
  ])

  const tools = allTools
    .filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((t) => ({
      name: t.name,
      slug: t.slug,
      emoji: t.emoji,
      tagline: t.tagline,
      type: "tool" as const,
    }))

  const startups = allStartups
    .filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.sector.some((sec) => sec.toLowerCase().includes(q))
    )
    .slice(0, 5)
    .map((s) => ({
      name: s.name,
      slug: s.slug,
      emoji: s.emoji,
      tagline: s.tagline,
      type: "startup" as const,
    }))

  const flows = allFlows
    .filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    )
    .slice(0, 3)
    .map((f) => ({
      name: f.title,
      slug: f.slug,
      emoji: f.emoji,
      tagline: f.description,
      type: "flow" as const,
    }))

  const categories = allCategories
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q)
    )
    .slice(0, 3)
    .map((c) => ({
      name: c.name,
      slug: c.slug,
      emoji: c.icon,
      tagline: c.tagline,
      type: "category" as const,
    }))

  return NextResponse.json({ tools, startups, flows, categories })
}
