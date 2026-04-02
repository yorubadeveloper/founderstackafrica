"use client"

import { useState } from "react"
import Link from "next/link"
import { List, X, CaretDown } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import type { Category } from "@/lib/types"
import { PHASE_ORDER, PHASE_DESCRIPTIONS, COUNTRY_FLAGS, COUNTRY_NAMES } from "@/lib/constants"
import type { Phase } from "@/lib/types"

interface NavProps {
  categories?: Category[]
}

const COUNTRIES = [
  { code: "NG", flag: COUNTRY_FLAGS.NG, name: COUNTRY_NAMES.NG },
  { code: "GH", flag: COUNTRY_FLAGS.GH, name: COUNTRY_NAMES.GH },
  { code: "KE", flag: COUNTRY_FLAGS.KE, name: COUNTRY_NAMES.KE },
  { code: "ZA", flag: COUNTRY_FLAGS.ZA, name: COUNTRY_NAMES.ZA },
  { code: "EG", flag: COUNTRY_FLAGS.EG, name: COUNTRY_NAMES.EG },
]

export function Nav({ categories = [] }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [browseOpen, setBrowseOpen] = useState(false)
  const [countriesOpen, setCountriesOpen] = useState(false)

  const categoriesByPhase = PHASE_ORDER.reduce<Record<Phase, Category[]>>(
    (acc, phase) => {
      acc[phase] = categories.filter((c) => c.phase === phase)
      return acc
    },
    {} as Record<Phase, Category[]>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="font-semibold text-foreground text-sm sm:text-base">
            FounderStack Africa
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Browse dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="text-sm"
                onClick={() => {
                  setBrowseOpen(!browseOpen)
                  setCountriesOpen(false)
                }}
              >
                Browse
                <CaretDown size={14} />
              </Button>
              {browseOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setBrowseOpen(false)}
                  />
                  <div className="absolute top-full left-0 z-50 mt-1 w-[600px] bg-card border border-border rounded-xl shadow-sm p-5">
                    <div className="grid grid-cols-2 gap-6">
                      {PHASE_ORDER.map((phase) => (
                        <div key={phase}>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                            {phase}
                          </p>
                          <p className="text-xs text-muted-foreground/60 mb-2">
                            {PHASE_DESCRIPTIONS[phase]}
                          </p>
                          <div className="space-y-1">
                            {categoriesByPhase[phase]?.map((cat) => (
                              <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="block text-sm text-foreground hover:text-foreground/70 py-1"
                                onClick={() => setBrowseOpen(false)}
                              >
                                {cat.icon} {cat.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Flows */}
            <Button render={<a href="/#flows" />} variant="ghost" className="text-sm">
              Flows
            </Button>

            {/* Countries dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                className="text-sm"
                onClick={() => {
                  setCountriesOpen(!countriesOpen)
                  setBrowseOpen(false)
                }}
              >
                Countries
                <CaretDown size={14} />
              </Button>
              {countriesOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCountriesOpen(false)}
                  />
                  <div className="absolute top-full left-0 z-50 mt-1 w-[200px] bg-card border border-border rounded-xl shadow-sm p-2">
                    {COUNTRIES.map((c) => (
                      <Link
                        key={c.code}
                        href={`/country/${c.code}`}
                        className="flex items-center gap-2 text-sm text-foreground hover:bg-muted rounded-lg px-3 py-2"
                        onClick={() => setCountriesOpen(false)}
                      >
                        {c.flag} {c.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2">
            <Button render={<Link href="/submit" />} variant="ghost" className="text-sm">
              Submit a tool
            </Button>
            <ThemeToggle />
            <Button render={<a href="/#newsletter" />} className="text-sm">
              Get updates
            </Button>
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="min-w-[44px] min-h-[44px]"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <List size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[280px] bg-background p-0">
          <SheetHeader className="p-4 pb-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="font-semibold text-foreground text-base">
                FounderStack Africa
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </Button>
            </div>
          </SheetHeader>
          <Separator className="mt-4" />
          <nav className="flex flex-col">
            <Link
              href="/"
              className="text-base text-foreground py-3 px-4 border-b border-border min-h-[48px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              Browse
            </Link>
            <a
              href="/#flows"
              className="text-base text-foreground py-3 px-4 border-b border-border min-h-[48px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              Flows
            </a>
            <Separator />
            {COUNTRIES.map((c) => (
              <Link
                key={c.code}
                href={`/country/${c.code}`}
                className="text-base text-foreground py-3 px-4 border-b border-border min-h-[48px] flex items-center"
                onClick={() => setMobileOpen(false)}
              >
                {c.flag} {c.name}
              </Link>
            ))}
            <Link
              href="/submit"
              className="text-base text-foreground py-3 px-4 border-b border-border min-h-[48px] flex items-center"
              onClick={() => setMobileOpen(false)}
            >
              Submit a Tool
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
