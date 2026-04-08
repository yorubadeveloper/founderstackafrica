"use client"

import { useState, useEffect } from "react"

interface OutdatedBadgeProps {
  lastVerified: string
}

export function OutdatedBadge({ lastVerified }: OutdatedBadgeProps) {
  const [isOutdated, setIsOutdated] = useState(false)

  useEffect(() => {
    const age = Date.now() - new Date(lastVerified).getTime()
    setIsOutdated(age > 180 * 24 * 60 * 60 * 1000)
  }, [lastVerified])

  if (!isOutdated) return null

  return (
    <span
      className="text-xs font-medium rounded-full px-2 py-0.5"
      style={{
        backgroundColor: "rgb(var(--badge-amber-bg))",
        color: "rgb(var(--badge-amber-text))",
      }}
    >
      May be outdated
    </span>
  )
}
