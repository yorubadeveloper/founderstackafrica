"use client"

import { useState } from "react"
import { StartupCard } from "@/components/StartupCard"
import type { Startup } from "@/lib/types"

const INITIAL = 18
const STEP = 18

interface StartupsGridProps {
  startups: Startup[]
}

export function StartupsGrid({ startups }: StartupsGridProps) {
  const [visible, setVisible] = useState(INITIAL)
  const shown = startups.slice(0, visible)
  const hasMore = visible < startups.length

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() =>
              setVisible((v) => Math.min(v + STEP, startups.length))
            }
            className="inline-flex items-center justify-center rounded-full text-sm font-medium h-10 px-6 shadow-btn text-muted-foreground hover:text-foreground transition-all"
          >
            See more startups
          </button>
        </div>
      )}
    </>
  )
}
