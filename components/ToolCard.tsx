"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  ArrowSquareOut,
  CheckCircle,
  XCircle,
  Warning,
  Clock,
} from "@phosphor-icons/react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)")
    setIsDesktop(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  return isDesktop
}

function ToolExpanded({ tool, open, onClose }: { tool: Tool; open: boolean; onClose: () => void }) {
  const isDesktop = useIsDesktop()
  const [isOutdated, setIsOutdated] = useState(false)

  useEffect(() => {
    if (tool.lastVerified) {
      const age = Date.now() - new Date(tool.lastVerified).getTime()
      setIsOutdated(age > 180 * 24 * 60 * 60 * 1000)
    }
  }, [tool.lastVerified])

  const content = (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <h2 className="text-xl font-semibold text-foreground">{tool.name}</h2>
            <AfricaBadge type={tool.africaCompatible} />
          </div>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium h-8 px-2.5 hover:bg-primary/80 transition-all shrink-0"
          >
            <span className="hidden sm:inline">Visit {tool.name}</span>
            <span className="sm:hidden">Visit</span>
            <ArrowSquareOut size={14} />
          </a>
        </div>
        {tool.affiliate && (
          <p className="text-xs text-muted-foreground italic">
            Affiliate link. We may earn a commission at no cost to you.
          </p>
        )}
      </div>

      <Separator />

      {/* About */}
      <div>
        <p className="text-sm leading-relaxed text-foreground">{tool.description}</p>
      </div>

      <Separator />

      {/* At a glance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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

      {/* Footer */}
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
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{tool.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh] p-6">{content}</ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>{tool.name}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full p-6">{content}</ScrollArea>
      </SheetContent>
    </Sheet>
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
