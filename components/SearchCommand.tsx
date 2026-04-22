"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlass, ArrowRight, Wrench, Rocket, Path, Square } from "@phosphor-icons/react/dist/ssr"

interface SearchResult {
  name: string
  slug: string
  emoji: string
  tagline: string
  type: "tool" | "startup" | "flow" | "category"
}

interface SearchResults {
  tools: SearchResult[]
  startups: SearchResult[]
  flows: SearchResult[]
  categories: SearchResult[]
}

const TYPE_LABELS: Record<string, { label: string; icon: typeof Wrench }> = {
  tool: { label: "Tools", icon: Wrench },
  startup: { label: "Startups", icon: Rocket },
  flow: { label: "Guides", icon: Path },
  category: { label: "Categories", icon: Square },
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
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

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

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery("")
      setResults(null)
      setActiveIndex(0)
    }
  }, [open])

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query || query.length < 2) {
      setResults(null)
      return
    }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setActiveIndex(0)
      } catch {
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 250)
  }, [query])

  // Flatten results for keyboard navigation
  const allResults: SearchResult[] = results
    ? [...results.tools, ...results.startups, ...results.flows, ...results.categories]
    : []

  const navigate = useCallback(
    (result: SearchResult) => {
      router.push(getHref(result))
      setOpen(false)
    },
    [router]
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
  const noResults = results && !hasResults && query.length >= 2

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setOpen(true)}
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-xs" />
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
                    Searching...
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

                {!loading && !results && (
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
