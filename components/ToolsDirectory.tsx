"use client"

import { useState } from "react"
import Link from "next/link"
import { ToolCard } from "@/components/ToolCard"
import type { Tool, Category, Phase } from "@/lib/types"

interface PhaseGroup {
  phase: Phase
  description: string
  categories: {
    category: Category
    tools: Tool[]
  }[]
}

interface ToolsDirectoryProps {
  phases: PhaseGroup[]
}

const INITIAL_PHASES = 2
const PHASE_STEP = 1

export function ToolsDirectory({ phases }: ToolsDirectoryProps) {
  const [visiblePhases, setVisiblePhases] = useState(INITIAL_PHASES)
  const shown = phases.slice(0, visiblePhases)
  const hasMore = visiblePhases < phases.length

  return (
    <>
      {shown.map(({ phase, description, categories }) => (
        <div key={phase} className="mb-16">
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {phase}
            </h2>
            <p className="text-xs text-muted-foreground/60">{description}</p>
          </div>

          {categories.map(({ category: cat, tools: catTools }) => (
            <div
              key={cat.id}
              className="mb-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-foreground">
                  {cat.icon} {cat.name}
                </h3>
                <Link
                  href={`/category/${cat.slug}`}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  View category &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() =>
              setVisiblePhases((v) => Math.min(v + PHASE_STEP, phases.length))
            }
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-6 shadow-btn text-muted-foreground hover:text-foreground transition-all"
          >
            See more tools
          </button>
        </div>
      )}
    </>
  )
}
