import type { Country, Phase, StartupCountry } from "./types"

/** Single source of truth for all supported countries. */
export const COUNTRIES: { code: string; name: string; flag: string }[] = [
  { code: "NG", name: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "GH", name: "Ghana", flag: "\u{1F1EC}\u{1F1ED}" },
  { code: "KE", name: "Kenya", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "ZA", name: "South Africa", flag: "\u{1F1FF}\u{1F1E6}" },
  { code: "EG", name: "Egypt", flag: "\u{1F1EA}\u{1F1EC}" },
  { code: "RW", name: "Rwanda", flag: "\u{1F1F7}\u{1F1FC}" },
  { code: "TN", name: "Tunisia", flag: "\u{1F1F9}\u{1F1F3}" },
  { code: "MA", name: "Morocco", flag: "\u{1F1F2}\u{1F1E6}" },
  { code: "SN", name: "Senegal", flag: "\u{1F1F8}\u{1F1F3}" },
  { code: "CI", name: "Ivory Coast", flag: "\u{1F1E8}\u{1F1EE}" },
  { code: "ET", name: "Ethiopia", flag: "\u{1F1EA}\u{1F1F9}" },
  { code: "TZ", name: "Tanzania", flag: "\u{1F1F9}\u{1F1FF}" },
  { code: "UG", name: "Uganda", flag: "\u{1F1FA}\u{1F1EC}" },
  { code: "DZ", name: "Algeria", flag: "\u{1F1E9}\u{1F1FF}" },
  { code: "CM", name: "Cameroon", flag: "\u{1F1E8}\u{1F1F2}" },
  { code: "ZW", name: "Zimbabwe", flag: "\u{1F1FF}\u{1F1FC}" },
  { code: "ZM", name: "Zambia", flag: "\u{1F1FF}\u{1F1F2}" },
  { code: "AO", name: "Angola", flag: "\u{1F1E6}\u{1F1F4}" },
  { code: "SD", name: "Sudan", flag: "\u{1F1F8}\u{1F1E9}" },
]

/** Derived lookup: code -> name (includes Pan-African). */
export const COUNTRY_NAMES: Record<string, string> = Object.fromEntries([
  ...COUNTRIES.map((c) => [c.code, c.name]),
  ["Pan-African", "Pan-African"],
])

/** Derived lookup: code -> flag emoji (no Pan-African). */
export const COUNTRY_FLAGS: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.flag]),
)

/** All 19 country codes (no Pan-African). Used for tool country routes. */
export const ALL_COUNTRY_CODES: Country[] = COUNTRIES.map(
  (c) => c.code,
) as Country[]

/** All 19 codes + Pan-African = 20 entries. Used for startup country routes. */
export const ALL_COUNTRIES_WITH_PAN: StartupCountry[] = [
  ...ALL_COUNTRY_CODES,
  "Pan-African",
] as StartupCountry[]

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
