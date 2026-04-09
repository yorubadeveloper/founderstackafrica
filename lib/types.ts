export type AfricaCompatible = "Yes" | "Partial" | "No"
export type ToolBadge = "Featured" | "Verified" | "New" | null
export type Country =
  | "NG"
  | "GH"
  | "KE"
  | "ZA"
  | "EG"
  | "RW"
  | "TN"
  | "MA"
  | "SN"
  | "CI"
  | "ET"
  | "TZ"
  | "UG"
  | "DZ"
  | "CM"
  | "ZW"
  | "ZM"
  | "AO"
  | "SD"
  | "Pan-African"
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
  slug: string
  emoji: string
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
  published: boolean
}

export interface Flow {
  id: string
  title: string
  slug: string
  emoji: string
  description: string
  country: Country | "Pan-African"
  steps: string
  relatedToolIds: string[]
  published: boolean
}

export type StartupSector =
  | "Fintech"
  | "Healthtech"
  | "Edtech"
  | "Agritech"
  | "Logistics"
  | "E-commerce"
  | "SaaS"
  | "Cleantech"
  | "Proptech"
  | "Insurtech"
  | "Media & Entertainment"
  | "HR & Recruitment"
  | "Legal Tech"
  | "Other"

export type StartupStage =
  | "Idea"
  | "Pre-seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C+"
  | "Bootstrapped"
  | "Acquired"

export type StartupCountry =
  | "NG"
  | "GH"
  | "KE"
  | "ZA"
  | "EG"
  | "RW"
  | "TN"
  | "MA"
  | "SN"
  | "CI"
  | "ET"
  | "TZ"
  | "UG"
  | "DZ"
  | "CM"
  | "ZW"
  | "ZM"
  | "AO"
  | "SD"
  | "Pan-African"

export interface Startup {
  id: string
  name: string
  slug: string
  emoji: string
  tagline: string
  sector: StartupSector[]
  stage: StartupStage
  country: StartupCountry[]
  description: string
  founded: number | null
  founders: string
  totalRaised: string
  website: string
  featured: boolean
  hiring: boolean
  published: boolean
}
