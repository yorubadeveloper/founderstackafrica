"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ArrowRight,
  ArrowSquareOut,
  CheckCircle,
  XCircle,
  Warning,
  Clock,
  X,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { AfricaBadge, AfricaNativeChip, FreeTierBadge, ToolBadgeChip } from "@/components/Badge"
import { CountryChip } from "@/components/CountryChip"
import type { Tool } from "@/lib/types"

interface ToolCardProps {
  tool: Tool
}

function ToolExpanded({ tool, open, onClose }: { tool: Tool; open: boolean; onClose: () => void }) {
  const [isOutdated, setIsOutdated] = useState(false)

  useEffect(() => {
    if (tool.lastVerified) {
      const age = Date.now() - new Date(tool.lastVerified).getTime()
      setIsOutdated(age > 180 * 24 * 60 * 60 * 1000)
    }
  }, [tool.lastVerified])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={tool.name}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Panel: full-screen on mobile, centered modal on desktop */}
      <div className="absolute inset-0 md:inset-6 md:m-auto md:max-w-2xl md:max-h-[85vh] md:rounded-xl flex flex-col bg-background md:border md:border-border md:shadow-sm overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 md:p-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="space-y-2 pr-8">
              <h2 className="text-xl font-semibold text-foreground">{tool.name}</h2>
              <AfricaBadge type={tool.africaCompatible} />
            </div>

            <Separator />

            {/* About */}
            <div>
              <p className="text-sm leading-relaxed text-foreground">{tool.description}</p>
            </div>

            <Separator />

            {/* At a glance */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Best for</p>
                <div className="flex flex-wrap gap-1">
                  {tool.bestFor.map((b) => (
                    <span
                      key={b}
                      className="bg-muted text-muted-foreground rounded-full text-xs px-2 py-0.5"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Works in</p>
                <div className="flex flex-wrap gap-1">
                  {tool.countries.map((c) => (
                    <CountryChip key={c} code={c} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Free tier</p>
                <FreeTierBadge tier={tool.freeTier} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Setup time</p>
                <span className="inline-flex items-center gap-1 text-sm text-foreground">
                  <Clock size={14} className="text-muted-foreground" />
                  {tool.setupTime}
                </span>
              </div>
            </div>

            <Separator />

            {/* Use when */}
            {tool.useWhen && (
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Use when</p>
                <div className="flex items-start gap-2">
                  <CheckCircle
                    weight="fill"
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: "rgb(var(--badge-green-text))" }}
                  />
                  <p className="text-sm text-foreground">{tool.useWhen}</p>
                </div>
              </div>
            )}

            {/* Skip when */}
            {tool.skipWhen && (
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Skip when</p>
                <div className="flex items-start gap-2">
                  <XCircle
                    weight="fill"
                    size={16}
                    className="mt-0.5 shrink-0 text-muted-foreground"
                  />
                  <p className="text-sm text-muted-foreground">{tool.skipWhen}</p>
                </div>
              </div>
            )}

            {/* Local Note */}
            {tool.localNote && (
              <div
                className="rounded-lg p-3"
                style={{
                  backgroundColor: "rgb(var(--badge-amber-bg))",
                  color: "rgb(var(--badge-amber-text))",
                }}
              >
                <div className="flex items-start gap-2">
                  <Warning weight="fill" size={16} className="mt-0.5 shrink-0" />
                  <p className="text-sm">{tool.localNote}</p>
                </div>
              </div>
            )}

            {/* Alternatives */}
            {tool.alternatives && (
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1">Alternatives</p>
                <p className="text-sm text-foreground">{tool.alternatives}</p>
              </div>
            )}

            {/* Verified date */}
            <div className="flex items-center gap-2">
              {tool.lastVerified && (
                <Tooltip>
                  <TooltipTrigger
                    render={<span className="inline-flex items-center gap-1 text-xs text-muted-foreground cursor-default" />}
                  >
                    <Clock size={14} />
                    Verified {new Date(tool.lastVerified).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Manually verified for Africa on this date</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {isOutdated && (
                <span
                  className="text-xs font-medium rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: "rgb(var(--badge-amber-bg))",
                    color: "rgb(var(--badge-amber-text))",
                  }}
                >
                  May be outdated
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sticky CTA footer */}
        <div className="shrink-0 border-t border-border bg-background p-4">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium h-11 px-4 hover:bg-primary/80 transition-all"
          >
            Visit {tool.name}
            <ArrowSquareOut size={16} />
          </a>
          {tool.affiliate && (
            <p className="text-xs text-muted-foreground/60 text-center mt-2">
              Affiliate link. We may earn a commission at no cost to you.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export function ToolCard({ tool }: ToolCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card
        className="relative bg-card border border-border rounded-xl hover:border-border/80 hover:shadow-sm dark:hover:shadow-none dark:hover:border-border/60 transition-all duration-150 cursor-pointer group h-full"
        onClick={() => setOpen(true)}
      >
        <CardContent className="p-5 flex flex-col h-full">
          {/* Row 1: Name + Badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-base text-foreground">{tool.name}</h3>
            {tool.badge && <ToolBadgeChip badge={tool.badge} />}
          </div>

          {/* Row 2: Tagline */}
          <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed mt-3">{tool.tagline}</p>

          {/* Row 3: Africa Compatible + Africa Native */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <AfricaBadge type={tool.africaCompatible} compact />
            {tool.africaNative && <AfricaNativeChip compact />}
          </div>

          {/* Row 4: Country chips */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tool.countries.map((c) => (
              <CountryChip key={c} code={c} />
            ))}
          </div>

          {/* Bottom section - pinned to bottom */}
          <div className="mt-auto pt-3">
            <Separator />

            {/* Row 5: Free tier + Setup time */}
            <div className="flex items-center justify-between mt-3">
              <FreeTierBadge tier={tool.freeTier} />
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={14} />
                {tool.setupTime}
              </span>
            </div>

            {/* Row 6: See details */}
            <div className="flex items-center justify-between text-sm font-medium text-foreground pt-3">
              <span>See details</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <ToolExpanded tool={tool} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
