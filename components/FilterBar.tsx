"use client"

import { useState } from "react"
import type { Tool } from "@/lib/types"

type FilterType = "all" | "works-in-africa" | "africa-built" | "free-tier"

interface FilterBarProps {
  tools: Tool[]
  onFilter: (filtered: Tool[]) => void
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "works-in-africa", label: "Works in Africa" },
  { key: "africa-built", label: "Africa-built" },
  { key: "free-tier", label: "Free tier" },
]

export function FilterBar({ tools, onFilter }: FilterBarProps) {
  const [active, setActive] = useState<FilterType>("all")

  function applyFilter(filter: FilterType) {
    setActive(filter)
    switch (filter) {
      case "works-in-africa":
        onFilter(tools.filter((t) => t.africaCompatible === "Yes"))
        break
      case "africa-built":
        onFilter(tools.filter((t) => t.africaNative))
        break
      case "free-tier":
        onFilter(tools.filter((t) => t.freeTier === "Yes"))
        break
      default:
        onFilter(tools)
    }
  }

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide snap-x pb-1">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          onClick={() => applyFilter(f.key)}
          className={`snap-start flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 min-h-[36px] ${
            active === f.key
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
