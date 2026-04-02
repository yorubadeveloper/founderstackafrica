import { COUNTRY_FLAGS, COUNTRY_NAMES } from "@/lib/constants"

interface CountryChipProps {
  code: string
}

export function CountryChip({ code }: CountryChipProps) {
  const flag = COUNTRY_FLAGS[code] || ""
  const name = COUNTRY_NAMES[code] || code

  return (
    <span className="inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5 text-muted-foreground">
      {flag && <span className="mr-1">{flag}</span>}
      {name}
    </span>
  )
}
