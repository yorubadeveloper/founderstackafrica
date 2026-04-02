"use client"

import { useState } from "react"
import { FilterBar } from "@/components/FilterBar"
import { ToolCard } from "@/components/ToolCard"
import { EmptyState } from "@/components/EmptyState"
import type { Tool } from "@/lib/types"

interface CategoryPageClientProps {
  tools: Tool[]
}

export function CategoryPageClient({ tools }: CategoryPageClientProps) {
  const [filtered, setFiltered] = useState<Tool[]>(tools)

  return (
    <>
      <div className="mb-6">
        <FilterBar tools={tools} onFilter={setFiltered} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </>
  )
}
