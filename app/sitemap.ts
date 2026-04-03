import type { MetadataRoute } from "next"
import { fetchCategories, fetchFlows } from "@/lib/notion"

const BASE_URL = "https://founderstackafrica.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, flows] = await Promise.all([
    fetchCategories(),
    fetchFlows(),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
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

  const countryRoutes: MetadataRoute.Sitemap = ["NG", "GH", "KE", "ZA", "EG", "RW"].map(
    (code) => ({
      url: `${BASE_URL}/country/${code}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  )

  return [...staticRoutes, ...categoryRoutes, ...flowRoutes, ...countryRoutes]
}
