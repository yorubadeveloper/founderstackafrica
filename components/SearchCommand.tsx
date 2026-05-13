"use client"

import { useState, useEffect, useRef, useCallback, useMemo, useDeferredValue } from "react"
import { useRouter } from "next/navigation"
import Fuse from "fuse.js"
import { MagnifyingGlass, ArrowRight, Wrench, Rocket, Path, Square } from "@phosphor-icons/react"

interface SearchResult {
  name: string
  slug: string
  emoji: string
  tagline: string
  type: "tool" | "startup" | "flow" | "category"
  extra?: string
}

const TYPE_LABELS: Record<string, { label: string; icon: typeof Wrench }> = {
  tool: { label: "Tools", icon: Wrench },
  startup: { label: "Startups", icon: Rocket },
  flow: { label: "Guides", icon: Path },
  category: { label: "Categories", icon: Square },
}

// Per-type result caps (preserved from the previous server route)
const TYPE_LIMITS: Record<SearchResult["type"], number> = {
  tool: 5,
  startup: 5,
  flow: 3,
  category: 3,
}

// Module-scoped cache so the index is fetched at most once per session,
// even if multiple SearchCommand instances mount.
let indexCache: SearchResult[] | null = null
let indexPromise: Promise<SearchResult[]> | null = null

async function loadIndex(): Promise<SearchResult[]> {
  if (indexCache) return indexCache
  if (indexPromise) return indexPromise
  indexPromise = fetch("/api/search")
    .then((r) => r.json())
    .then((data: { items: SearchResult[] }) => {
      indexCache = data.items ?? []
      return indexCache
    })
    .catch(() => {
      indexPromise = null
      return []
    })
  return indexPromise
}

function getHref(result: SearchResult): string {
  switch (result.type) {
    case "tool":
      return `/tool/${result.slug}`
    case "startup":
      return `/startup/${result.slug}`
    case "flow":
      return `/flow/${result.slug}`
    case "category":
      return `/category/${result.slug}`
  }
}

export function SearchCommand() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [items, setItems] = useState<SearchResult[] | null>(indexCache)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // Prefetch on hover/focus of the trigger — almost always hides the fetch latency
  const prefetchIndex = useCallback(() => {
    if (!indexCache) void loadIndex()
  }, [])

  // Focus + lazy-load on open
  useEffect(() => {
    if (!open) return
    setTimeout(() => inputRef.current?.focus(), 50)
    setQuery("")
    setActiveIndex(0)
    if (indexCache) {
      setItems(indexCache)
      return
    }
    setLoading(true)
    loadIndex()
      .then((data) => setItems(data))
      .finally(() => setLoading(false))
  }, [open])

  // Build Fuse instance once per dataset
  const fuse = useMemo(() => {
    if (!items) return null
    return new Fuse(items, {
      keys: [
        { name: "name", weight: 0.6 },
        { name: "tagline", weight: 0.3 },
        { name: "extra", weight: 0.1 },
      ],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
      includeScore: true,
    })
  }, [items])

  // Run search on a deferred copy of the query so the input itself stays
  // responsive even if Fuse takes a few ms.
  const deferredQuery = useDeferredValue(query)

  // Run search synchronously on every keystroke (no debounce needed — it's all in memory)
  const allResults: SearchResult[] = useMemo(() => {
    if (!fuse || !deferredQuery || deferredQuery.length < 2) return []
    const hits = fuse.search(deferredQuery, { limit: 50 })

    // Group by type, then re-flatten in fixed order with per-type caps,
    // preserving Fuse's relevance ordering within each type.
    const byType: Record<SearchResult["type"], SearchResult[]> = {
      tool: [],
      startup: [],
      flow: [],
      category: [],
    }
    for (const h of hits) {
      const type = h.item.type
      if (byType[type].length < TYPE_LIMITS[type]) byType[type].push(h.item)
    }
    return [...byType.tool, ...byType.startup, ...byType.flow, ...byType.category]
  }, [fuse, deferredQuery])

  // Reset highlight whenever the result set changes
  useEffect(() => {
    setActiveIndex(0)
  }, [deferredQuery])

  const navigate = useCallback(
    (result: SearchResult) => {
      router.push(getHref(result))
      setOpen(false)
    },
    [router],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, allResults.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && allResults[activeIndex]) {
      navigate(allResults[activeIndex])
    }
  }

  const hasResults = allResults.length > 0
  const noResults = !loading && !hasResults && deferredQuery.length >= 2 && items !== null

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
        onMouseEnter={prefetchIndex}
        onFocus={prefetchIndex}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card text-muted-foreground text-sm h-8 px-3 hover:bg-accent transition-colors"
      >
        <MagnifyingGlass size={14} weight="bold" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-[100]" onClick={() => setOpen(false)}>
          <div className="fixed inset-0 bg-foreground/15" />
          <div className="fixed inset-x-0 top-[15vh] flex justify-center px-4">
            <div
              className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 border-b border-border">
                <MagnifyingGlass size={18} className="text-muted-foreground shrink-0" weight="bold" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search tools, startups, guides..."
                  className="flex-1 h-12 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto">
                {loading && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    Loading search...
                  </div>
                )}

                {!loading && noResults && (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                )}

                {!loading && hasResults && (
                  <div className="py-2">
                    {(["tool", "startup", "flow", "category"] as const).map((type) => {
                      const items = allResults.filter((r) => r.type === type)
                      if (items.length === 0) return null
                      const { label } = TYPE_LABELS[type]
                      return (
                        <div key={type}>
                          <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {label}
                          </div>
                          {items.map((result) => {
                            const idx = allResults.indexOf(result)
                            return (
                              <button
                                key={`${result.type}-${result.slug}`}
                                onClick={() => navigate(result)}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                  idx === activeIndex
                                    ? "bg-accent"
                                    : "hover:bg-accent/50"
                                }`}
                              >
                                <span className="text-lg shrink-0">{result.emoji}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground truncate">
                                    {result.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {result.tagline}
                                  </div>
                                </div>
                                <ArrowRight size={14} className="text-muted-foreground shrink-0" />
                              </button>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )}

                {!loading && query.length < 2 && (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Start typing to search across tools, startups, and guides
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
