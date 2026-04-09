"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { slugify } from "@/lib/utils"
import { COUNTRIES } from "@/lib/constants"

const SECTORS = [
  "Fintech",
  "Healthtech",
  "Edtech",
  "Agritech",
  "Logistics",
  "E-commerce",
  "SaaS",
]

const STAGES = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Bootstrapped",
]

export function Footer() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="bg-white dark:bg-card" style={{ boxShadow: "inset 0 1px 0 0 rgba(0,0,0,0.06)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Logo + tagline */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Image
              src="/logo.png"
              alt="FounderStack Africa"
              width={140}
              height={40}
              className="h-7 w-auto"
            />
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-xs">
              The operating system for African founders.
            </p>
          </div>

          {/* Explore */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Explore
            </p>
            <Link
              href="/tools"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              All tools
            </Link>
            <Link
              href="/startups"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Startups
            </Link>
            <Link
              href="/flows"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Flows
            </Link>
            <Link
              href="/submit"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Submit a tool
            </Link>
            <Link
              href="/submit?tab=startup"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Submit a startup
            </Link>
          </div>

          {/* Countries */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Countries
            </p>
            {COUNTRIES.map((c) => (
              <Link
                key={c.code}
                href={`/country/${c.code}`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Sectors — now using dedicated routes */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Sectors
            </p>
            {SECTORS.map((s) => (
              <Link
                key={s}
                href={`/startups/sector/${slugify(s)}`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>

          {/* Stages — now using dedicated routes */}
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
              Stages
            </p>
            {STAGES.map((s) => (
              <Link
                key={s}
                href={`/startups/stage/${slugify(s)}`}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <p className="text-xs text-muted-foreground/60">
            &copy; {year ?? ""} FounderStack Africa
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/founderstackafr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              Twitter / X
            </a>
            <span className="text-xs text-muted-foreground/40">&middot;</span>
            <a
              href="https://x.com/BukunmiOA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
              style={{ fontWeight: 500 }}
            >
              Crafted by Bukunmi
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
