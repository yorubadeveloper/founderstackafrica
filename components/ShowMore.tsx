"use client"

import { useState, type ReactNode, Children } from "react"

interface ShowMoreProps {
  /** All items to progressively reveal (each child = one unit) */
  children: ReactNode
  /** How many items to show initially */
  initial: number
  /** How many items to reveal per click */
  step: number
  /** Button label (default: "See more") */
  label?: string
}

export function ShowMore({
  children,
  initial,
  step,
  label = "See more",
}: ShowMoreProps) {
  const items = Children.toArray(children)
  const [visible, setVisible] = useState(initial)

  const hasMore = visible < items.length

  return (
    <>
      {items.slice(0, visible)}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisible((v) => Math.min(v + step, items.length))}
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium h-10 px-6 shadow-btn text-muted-foreground hover:text-foreground transition-all"
          >
            {label}
          </button>
        </div>
      )}
    </>
  )
}
