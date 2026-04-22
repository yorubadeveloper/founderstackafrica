import { Client } from "@notionhq/client"
import { cacheLife, cacheTag } from "next/cache"
import type {
  Category,
  Tool,
  Flow,
  Startup,
  AfricaCompatible,
  ToolBadge,
  Country,
  FreeTier,
  SetupTime,
  Phase,
  StartupSector,
  StartupStage,
  StartupCountry,
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
function getPageEmoji(result: any): string {
  if (result.icon?.type === "emoji") {
    return result.icon.emoji || ""
  }
  return ""
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
    slug: getRichText(props, "Slug"),
    emoji: getPageEmoji(result),
    tagline: getRichText(props, "Tagline"),
    description: getRichText(props, "Description"),
    url: getUrl(props, "URL"),
    categoryIds: categoryRelation,
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
    published: getCheckbox(props, "Published"),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFlow(result: any): Flow {
  const props = result.properties
  return {
    id: result.id,
    title: getTitle(props, "Title"),
    slug: getRichText(props, "Slug"),
    emoji: getPageEmoji(result),
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
    const allResults: Tool[] = []
    let cursor: string | undefined = undefined
    do {
      const res = await notion.databases.query({
        database_id: process.env.NOTION_TOOLS_DB_ID!,
        filter: {
          property: "Published",
          checkbox: { equals: true },
        },
        sorts: [{ property: "Name", direction: "ascending" }],
        start_cursor: cursor,
      })
      allResults.push(...res.results.map(mapTool))
      cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
    } while (cursor)
    return allResults
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
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Category", relation: { contains: categoryId } },
        ],
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
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Countries", multi_select: { contains: code } },
        ],
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
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Badge", select: { equals: "Featured" } },
        ],
      },
      page_size: 6,
    })
    return res.results.map(mapTool)
  } catch (e) {
    console.error("fetchFeaturedTools failed:", e)
    return []
  }
}

export async function fetchToolBySlug(slug: string): Promise<Tool | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("tools")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_TOOLS_DB_ID!,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Slug", rich_text: { equals: slug } },
        ],
      },
    })
    if (res.results.length === 0) return null
    return mapTool(res.results[0])
  } catch (e) {
    console.error("fetchToolBySlug failed:", e)
    return null
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

// ---------------------------------------------------------------------------
// Startups
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapStartup(result: any): Startup {
  const props = result.properties
  return {
    id: result.id,
    name: getTitle(props, "Name"),
    slug: getRichText(props, "Slug"),
    emoji: getPageEmoji(result),
    tagline: getRichText(props, "Tagline"),
    sector: getMultiSelect(props, "Sector") as StartupSector[],
    stage: (getSelect(props, "Stage") || "Seed") as StartupStage,
    country: getMultiSelect(props, "Country") as StartupCountry[],
    description: getRichText(props, "Description"),
    founded: getNumber(props, "Founded") || null,
    founders: getRichText(props, "Founders"),
    totalRaised: getRichText(props, "Total Raised"),
    website: getUrl(props, "Website"),
    featured: getCheckbox(props, "Featured"),
    hiring: getCheckbox(props, "Hiring"),
    published: getCheckbox(props, "Published"),
  }
}

export async function fetchStartups(): Promise<Startup[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("startups")
  try {
    const allResults: Startup[] = []
    let cursor: string | undefined = undefined
    do {
      const res = await notion.databases.query({
        database_id: process.env.NOTION_STARTUPS_DB_ID!,
        filter: {
          property: "Published",
          checkbox: { equals: true },
        },
        sorts: [{ property: "Name", direction: "ascending" }],
        start_cursor: cursor,
      })
      allResults.push(...res.results.map(mapStartup))
      cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
    } while (cursor)
    return allResults
  } catch (e) {
    console.error("fetchStartups failed:", e)
    return []
  }
}

export async function fetchFeaturedStartups(): Promise<Startup[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("startups")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_STARTUPS_DB_ID!,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Featured", checkbox: { equals: true } },
        ],
      },
      page_size: 6,
    })
    return res.results.map(mapStartup)
  } catch (e) {
    console.error("fetchFeaturedStartups failed:", e)
    return []
  }
}

export async function fetchStartupsBySector(sector: string): Promise<Startup[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("startups")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_STARTUPS_DB_ID!,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Sector", multi_select: { contains: sector } },
        ],
      },
      sorts: [{ property: "Name", direction: "ascending" }],
    })
    return res.results.map(mapStartup)
  } catch (e) {
    console.error("fetchStartupsBySector failed:", e)
    return []
  }
}

export async function fetchStartupsByCountry(country: string): Promise<Startup[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("startups")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_STARTUPS_DB_ID!,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Country", multi_select: { contains: country } },
        ],
      },
      sorts: [{ property: "Name", direction: "ascending" }],
    })
    return res.results.map(mapStartup)
  } catch (e) {
    console.error("fetchStartupsByCountry failed:", e)
    return []
  }
}

export async function fetchStartupsByStage(stage: string): Promise<Startup[]> {
  "use cache"
  cacheLife("hours")
  cacheTag("startups")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_STARTUPS_DB_ID!,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Stage", select: { equals: stage } },
        ],
      },
      sorts: [{ property: "Name", direction: "ascending" }],
    })
    return res.results.map(mapStartup)
  } catch (e) {
    console.error("fetchStartupsByStage failed:", e)
    return []
  }
}

export async function fetchStartupBySlug(slug: string): Promise<Startup | null> {
  "use cache"
  cacheLife("hours")
  cacheTag("startups")
  try {
    const res = await notion.databases.query({
      database_id: process.env.NOTION_STARTUPS_DB_ID!,
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Slug", rich_text: { equals: slug } },
        ],
      },
    })
    if (res.results.length === 0) return null
    return mapStartup(res.results[0])
  } catch (e) {
    console.error("fetchStartupBySlug failed:", e)
    return null
  }
}

// ---------------------------------------------------------------------------
// Write operations (submissions)
// ---------------------------------------------------------------------------

export interface ToolSubmissionData {
  name: string
  url: string
  tagline: string
  description?: string
  countries: string[]
  categoryId?: string
  freeTier?: string
}

export async function createToolSubmission(data: ToolSubmissionData) {
  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: data.name } }] },
    URL: { url: data.url },
    Tagline: { rich_text: [{ text: { content: data.tagline } }] },
    Published: { checkbox: false },
    Countries: {
      multi_select: data.countries.map((c) => ({ name: c })),
    },
  }

  if (data.description) {
    properties.Description = {
      rich_text: [{ text: { content: data.description } }],
    }
  }
  if (data.categoryId) {
    properties.Category = { relation: [{ id: data.categoryId }] }
  }
  if (data.freeTier) {
    properties["Free Tier"] = { select: { name: data.freeTier } }
  }

  return notion.pages.create({
    parent: { database_id: process.env.NOTION_TOOLS_DB_ID! },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: properties as any,
  })
}

export interface StartupSubmissionData {
  name: string
  website?: string
  tagline: string
  description?: string
  sector: string
  stage: string
  country: string[]
  founded?: number
  founders?: string
}

export async function createStartupSubmission(data: StartupSubmissionData) {
  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: data.name } }] },
    Tagline: { rich_text: [{ text: { content: data.tagline } }] },
    Published: { checkbox: false },
    Sector: { multi_select: [{ name: data.sector }] },
    Stage: { select: { name: data.stage } },
    Country: {
      multi_select: data.country.map((c) => ({ name: c })),
    },
  }

  if (data.website) {
    properties.Website = { url: data.website }
  }
  if (data.description) {
    properties.Description = {
      rich_text: [{ text: { content: data.description } }],
    }
  }
  if (data.founded) {
    properties.Founded = { number: data.founded }
  }
  if (data.founders) {
    properties.Founders = {
      rich_text: [{ text: { content: data.founders } }],
    }
  }

  return notion.pages.create({
    parent: { database_id: process.env.NOTION_STARTUPS_DB_ID! },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: properties as any,
  })
}
