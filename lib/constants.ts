import type { Phase } from "./types"

export const COUNTRY_NAMES: Record<string, string> = {
  NG: "Nigeria",
  GH: "Ghana",
  KE: "Kenya",
  ZA: "South Africa",
  EG: "Egypt",
  "Pan-African": "Pan-African",
}

export const COUNTRY_FLAGS: Record<string, string> = {
  NG: "\u{1F1F3}\u{1F1EC}",
  GH: "\u{1F1EC}\u{1F1ED}",
  KE: "\u{1F1F0}\u{1F1EA}",
  ZA: "\u{1F1FF}\u{1F1E6}",
  EG: "\u{1F1EA}\u{1F1EC}",
}

export const PHASE_ORDER: Phase[] = [
  "Start",
  "Money",
  "Build",
  "Grow",
  "Africa-specific",
]

export const PHASE_DESCRIPTIONS: Record<Phase, string> = {
  Start: "Register, get legal, open accounts",
  Money: "Payments, invoicing, banking, fundraising",
  Build: "Tech, hosting, no-code, product tools",
  Grow: "Marketing, email, SEO, community",
  "Africa-specific": "Cross-border, grants, compliance, local ops",
}

export const CATEGORY_ICONS: Record<Phase, string> = {
  Start: "Rocket",
  Money: "CurrencyDollar",
  Build: "Hammer",
  Grow: "ChartLineUp",
  "Africa-specific": "Globe",
}
