import type { MetadataRoute } from "next"
import { fetchCategories, fetchFlows, fetchAllTools, fetchStartups } from "@/lib/notion"
import { slugify } from "@/lib/utils"
import type { StartupSector, StartupStage } from "@/lib/types"
import { ALL_COUNTRY_CODES, ALL_COUNTRIES_WITH_PAN } from "@/lib/constants"

const BASE_URL = "https://founderstackafrica.com"

const ALL_SECTORS: StartupSector[] = [
  "Fintech", "Healthtech", "Edtech", "Agritech", "Logistics",
  "E-commerce", "SaaS", "Cleantech", "Proptech", "Insurtech",
  "Media & Entertainment", "HR & Recruitment", "Legal Tech", "Other",
]

const ALL_STAGES: StartupStage[] = [
  "Idea", "Pre-seed", "Seed", "Series A", "Series B",
  "Series C+", "Bootstrapped", "Acquired",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, flows, tools, startups] = await Promise.all([
    fetchCategories(),
    fetchFlows(),
    fetchAllTools(),
    fetchStartups(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/startups`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/flows`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/submit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const flowRoutes: MetadataRoute.Sitemap = flows.map((f) => ({
    url: `${BASE_URL}/flow/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((t) => t.slug)
    .map((t) => ({
      url: `${BASE_URL}/tool/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

  const startupRoutes: MetadataRoute.Sitemap = startups
    .filter((s) => s.slug)
    .map((s) => ({
      url: `${BASE_URL}/startup/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

  const countryRoutes: MetadataRoute.Sitemap = ALL_COUNTRY_CODES.map(
    (code) => ({
      url: `${BASE_URL}/country/${code}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  )

  // Startup filter routes: sector, stage, country
  const sectorRoutes: MetadataRoute.Sitemap = ALL_SECTORS.map((s) => ({
    url: `${BASE_URL}/startups/sector/${slugify(s)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const stageRoutes: MetadataRoute.Sitemap = ALL_STAGES.map((s) => ({
    url: `${BASE_URL}/startups/stage/${slugify(s)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const startupCountryRoutes: MetadataRoute.Sitemap = ALL_COUNTRIES_WITH_PAN.map((c) => ({
    url: `${BASE_URL}/startups/country/${c}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...flowRoutes,
    ...toolRoutes,
    ...startupRoutes,
    ...countryRoutes,
    ...sectorRoutes,
    ...stageRoutes,
    ...startupCountryRoutes,
  ]
}
