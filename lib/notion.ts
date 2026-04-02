import { Client } from "@notionhq/client"
import { cacheLife, cacheTag } from "next/cache"
import type {
  Category,
  Tool,
  Flow,
  AfricaCompatible,
  ToolBadge,
  Country,
  FreeTier,
  SetupTime,
  Phase,
} from "./types"

const notion = new Client({ auth: process.env.NOTION_SECRET })

// Helper to extract property values from Notion pages
function getTitle(page: Record<string, unknown>, prop: string): string {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown[]>).title) {
    const titleArr = (p as Record<string, { plain_text: string }[]>).title
    return titleArr.map((t) => t.plain_text).join("")
  }
  return ""
}

function getRichText(page: Record<string, unknown>, prop: string): string {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown[]>).rich_text) {
    const rtArr = (p as Record<string, { plain_text: string }[]>).rich_text
    return rtArr.map((t) => t.plain_text).join("")
  }
  return ""
}

function getNumber(page: Record<string, unknown>, prop: string): number {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown>).number !== undefined) {
    return ((p as Record<string, unknown>).number as number) || 0
  }
  return 0
}

function getSelect(page: Record<string, unknown>, prop: string): string {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown>).select) {
    return ((p as Record<string, Record<string, string>>).select?.name) || ""
  }
  return ""
}

function getMultiSelect(page: Record<string, unknown>, prop: string): string[] {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown[]>).multi_select) {
    return ((p as Record<string, { name: string }[]>).multi_select).map((s) => s.name)
  }
  return []
}

function getCheckbox(page: Record<string, unknown>, prop: string): boolean {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown>).checkbox !== undefined) {
    return (p as Record<string, boolean>).checkbox || false
  }
  return false
}

function getUrl(page: Record<string, unknown>, prop: string): string {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown>).url) {
    return ((p as Record<string, string>).url) || ""
  }
  return ""
}

function getDate(page: Record<string, unknown>, prop: string): string | null {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown>).date) {
    return ((p as Record<string, Record<string, string>>).date?.start) || null
  }
  return null
}

function getRelation(page: Record<string, unknown>, prop: string): string[] {
  const p = (page as Record<string, Record<string, unknown>>)[prop]
  if (p && (p as Record<string, unknown[]>).relation) {
    return ((p as Record<string, { id: string }[]>).relation).map((r) => r.id)
  }
  return []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(result: any): Category {
  const props = result.properties
  return {
    id: result.id,
    name: getTitle(props, "Name"),
    slug: getRichText(props, "Slug"),
    icon: getRichText(props, "Icon"),
    tagline: getRichText(props, "Tagline"),
    description: getRichText(props, "Description"),
    order: getNumber(props, "Order"),
    phase: (getSelect(props, "Phase") || "Start") as Phase,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTool(result: any): Tool {
  const props = result.properties
  const categoryRelation = getRelation(props, "Category")
  return {
    id: result.id,
    name: getTitle(props, "Name"),
    tagline: getRichText(props, "Tagline"),
    description: getRichText(props, "Description"),
    url: getUrl(props, "URL"),
    categoryId: categoryRelation[0] || "",
    categoryName: "",
    bestFor: getMultiSelect(props, "Best For"),
    africaCompatible: (getSelect(props, "Africa Compatible") || "No") as AfricaCompatible,
    africaNative: getCheckbox(props, "Africa Native"),
    countries: getMultiSelect(props, "Countries") as Country[],
    freeTier: (getSelect(props, "Free Tier") || "No") as FreeTier,
    setupTime: (getSelect(props, "Setup Time") || "1 day") as SetupTime,
    useWhen: getRichText(props, "Use When"),
    skipWhen: getRichText(props, "Skip When"),
    localNote: getRichText(props, "Local Note"),
    alternatives: getRichText(props, "Alternatives"),
    badge: (getSelect(props, "Badge") || null) as ToolBadge,
    affiliate: getCheckbox(props, "Affiliate"),
    lastVerified: getDate(props, "Last Verified"),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFlow(result: any): Flow {
  const props = result.properties
  return {
    id: result.id,
    title: getTitle(props, "Title"),
    slug: getRichText(props, "Slug"),
    description: getRichText(props, "Description"),
    country: (getSelect(props, "Country") || "Pan-African") as Country | "Pan-African",
    steps: getRichText(props, "Steps"),
    relatedToolIds: getRelation(props, "Related Tools"),
    published: getCheckbox(props, "Published"),
  }
}

export async function fetchCategories(): Promise<Category[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("categories")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_CATEGORIES_DB_ID!,
      sorts: [{ property: "Order", direction: "ascending" }],
    })
    return res.results.map(mapCategory)
  } catch (e) {
    console.error("fetchCategories failed:", e)
    return []
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("categories")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_CATEGORIES_DB_ID!,
      filter: {
        property: "Slug",
        rich_text: { equals: slug },
      },
    })
    if (res.results.length === 0) return null
    return mapCategory(res.results[0])
  } catch (e) {
    console.error("fetchCategoryBySlug failed:", e)
    return null
  }
}

export async function fetchAllTools(): Promise<Tool[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("tools")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DB_ID!,
      sorts: [{ property: "Name", direction: "ascending" }],
    })
    return res.results.map(mapTool)
  } catch (e) {
    console.error("fetchAllTools failed:", e)
    return []
  }
}

export async function fetchToolsByCategory(categoryId: string): Promise<Tool[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("tools")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DB_ID!,
      filter: {
        property: "Category",
        relation: { contains: categoryId },
      },
      sorts: [{ property: "Name", direction: "ascending" }],
    })
    return res.results.map(mapTool)
  } catch (e) {
    console.error("fetchToolsByCategory failed:", e)
    return []
  }
}

export async function fetchToolsByCountry(code: string): Promise<Tool[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("tools")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DB_ID!,
      filter: {
        property: "Countries",
        multi_select: { contains: code },
      },
      sorts: [{ property: "Name", direction: "ascending" }],
    })
    return res.results.map(mapTool)
  } catch (e) {
    console.error("fetchToolsByCountry failed:", e)
    return []
  }
}

export async function fetchFeaturedTools(): Promise<Tool[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("tools")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DB_ID!,
      filter: {
        property: "Badge",
        select: { equals: "Featured" },
      },
      page_size: 6,
    })
    return res.results.map(mapTool)
  } catch (e) {
    console.error("fetchFeaturedTools failed:", e)
    return []
  }
}

export async function fetchFlows(country?: string): Promise<Flow[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("flows")
  try {
    if (country) {
      const res = await notion.databases.query({
        database_id: process.env.NOTION_FLOWS_DB_ID!,
        filter: {
          and: [
            {
              property: "Published",
              checkbox: { equals: true },
            },
            {
              property: "Country",
              select: { equals: country },
            },
          ],
        },
      })
      return res.results.map(mapFlow)
    }
    const res = await notion.databases.query({
      database_id: process.env.NOTION_FLOWS_DB_ID!,
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
    })
    return res.results.map(mapFlow)
  } catch (e) {
    console.error("fetchFlows failed:", e)
    return []
  }
}

export async function fetchFlow(slug: string): Promise<Flow | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("flows")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_FLOWS_DB_ID!,
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: { equals: slug },
          },
          {
            property: "Published",
            checkbox: { equals: true },
          },
        ],
      },
    })
    if (res.results.length === 0) return null
    return mapFlow(res.results[0])
  } catch (e) {
    console.error("fetchFlow failed:", e)
    return null
  }
}
