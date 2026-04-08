import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { AfricaBadge, FreeTierBadge, ToolBadgeChip } from "@/components/Badge"
import type { Tool } from "@/lib/types"

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tool/${tool.slug}`} className="block h-full">
      <div className="shadow-card rounded-xl cursor-pointer group h-full">
        <div className="p-5 flex flex-col h-full">
          {/* Row 1: Emoji + Name + Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {tool.emoji && (
                <span className="text-2xl leading-none">{tool.emoji}</span>
              )}
              <h3 className="font-medium text-base text-foreground">{tool.name}</h3>
            </div>
            {tool.badge && <ToolBadgeChip badge={tool.badge} />}
          </div>

          {/* Row 2: Tagline */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-2">
            {tool.tagline}
          </p>

          {/* Row 3: Africa Compatible */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <AfricaBadge type={tool.africaCompatible} compact />
          </div>

          {/* Bottom section */}
          <div className="mt-auto pt-3">
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <FreeTierBadge tier={tool.freeTier} />
              <span>{tool.setupTime}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-medium text-foreground pt-3">
              <span>See details</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
