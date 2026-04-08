"use client"

import Link from "next/link"
import type { Tool, Category } from "@/lib/types"

interface ToolMarqueeProps {
  tools: Tool[]
  categories?: Category[]
}

/**
 * 3-row scrolling ticker — emoji + tool name in subtle chips.
 * Row 1 scrolls left, Row 2 scrolls right, Row 3 scrolls left.
 * Slow, smooth, continuous scroll with edge fades.
 */
export function ToolMarquee({ tools, categories = [] }: ToolMarqueeProps) {
  if (tools.length === 0) return null

  // Build category icon lookup for fallback
  const catIconMap = new Map(categories.map((c) => [c.id, c.icon]))

  function getEmoji(tool: Tool): string {
    return tool.emoji || catIconMap.get(tool.categoryId) || "\u{1F527}"
  }

  // Split tools into 3 roughly equal rows
  const third = Math.ceil(tools.length / 3)
  const row1 = tools.slice(0, third)
  const row2 = tools.slice(third, third * 2)
  const row3 = tools.slice(third * 2)

  return (
    <div className="relative overflow-hidden py-4">
      {/* Edge fade overlays */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

      <div className="space-y-2.5">
        <MarqueeRow tools={row1} getEmoji={getEmoji} direction="left" speed="120s" />
        <MarqueeRow tools={row2} getEmoji={getEmoji} direction="right" speed="130s" />
        <MarqueeRow tools={row3} getEmoji={getEmoji} direction="left" speed="140s" />
      </div>
    </div>
  )
}

function MarqueeRow({
  tools,
  getEmoji,
  direction,
  speed,
}: {
  tools: Tool[]
  getEmoji: (tool: Tool) => string
  direction: "left" | "right"
  speed: string
}) {
  // Double for seamless loop
  const items = [...tools, ...tools]

  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 gap-3 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        style={{ animationDuration: speed }}
      >
        {items.map((tool, i) => (
          <Link
            key={`${tool.id}-${i}`}
            href={`/tool/${tool.slug}`}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm whitespace-nowrap hover:bg-muted/80 transition-colors"
            style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}
          >
            <span className="text-sm leading-none">{getEmoji(tool)}</span>
            <span className="font-medium text-foreground/80">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
