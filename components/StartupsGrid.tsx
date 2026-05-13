"use client"

import { useEffect, useRef, useState } from "react"
import { StartupCard } from "@/components/StartupCard"
import type { Startup } from "@/lib/types"

const INITIAL = 18
const STEP = 18

interface StartupsGridProps {
  startups: Startup[]
}

export function StartupsGrid({ startups }: StartupsGridProps) {
  const [visible, setVisible] = useState(INITIAL)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const shown = startups.slice(0, visible)
  const hasMore = visible < startups.length

  useEffect(() => {
    if (!hasMore) return
    const node = sentinelRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible((v) => Math.min(v + STEP, startups.length))
        }
      },
      { rootMargin: "600px 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, startups.length])

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {shown.map((startup) => (
          <StartupCard key={startup.id} startup={startup} />
        ))}
      </div>
      {hasMore && (
        <>
          <div ref={sentinelRef} aria-hidden="true" className="h-1 w-full" />
          <div className="flex justify-center mt-10">
            <span className="text-sm text-muted-foreground">
              Loading more startups…
            </span>
          </div>
        </>
      )}
    </>
  )
}
