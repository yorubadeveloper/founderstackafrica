export type AfricaCompatible = "Yes" | "Partial" | "No"
export type ToolBadge = "Featured" | "Verified" | "New" | null
export type Country = "NG" | "GH" | "KE" | "ZA" | "EG" | "RW" | "Pan-African"
export type FreeTier = "Yes" | "No" | "Trial only"
export type SetupTime = "< 1 hour" | "1 day" | "2–5 days" | "1+ week"
export type Phase = "Start" | "Money" | "Build" | "Grow" | "Africa-specific"

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  tagline: string
  description: string
  order: number
  phase: Phase
  toolCount?: number
}

export interface Tool {
  id: string
  name: string
  tagline: string
  description: string
  url: string
  categoryId: string
  categoryName: string
  bestFor: string[]
  africaCompatible: AfricaCompatible
  africaNative: boolean
  countries: Country[]
  freeTier: FreeTier
  setupTime: SetupTime
  useWhen: string
  skipWhen: string
  localNote: string
  alternatives: string
  badge: ToolBadge
  affiliate: boolean
  lastVerified: string | null
}

export interface Flow {
  id: string
  title: string
  slug: string
  description: string
  country: Country | "Pan-African"
  steps: string
  relatedToolIds: string[]
  published: boolean
}
