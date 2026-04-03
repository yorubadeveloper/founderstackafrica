"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export function Footer() {
  const [year, setYear] = useState<number | null>(null)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row justify-between gap-10">
          {/* Left: Logo + tagline */}
          <div className="max-w-xs">
            <Image
              src="/logo.png"
              alt="FounderStack Africa"
              width={140}
              height={40}
              className="h-7 w-auto dark:hidden"
            />
            <Image
              src="/logo-white.png"
              alt="FounderStack Africa"
              width={140}
              height={40}
              className="h-7 w-auto hidden dark:block"
            />
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              The operating system for African founders.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex flex-wrap gap-8 sm:gap-12">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                Explore
              </p>
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Browse
              </Link>
              <Link
                href="/flows"
                className="block text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Flows
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                Countries
              </p>
              <Link
                href="/country/NG"
                className="block text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Nigeria
              </Link>
              <Link
                href="/country/GH"
                className="block text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Ghana
              </Link>
              <Link
                href="/country/KE"
                className="block text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Kenya
              </Link>
              <Link
                href="/country/RW"
                className="block text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Rwanda
              </Link>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
                Contribute
              </p>
              <Link
                href="/submit"
                className="block text-sm text-muted-foreground hover:text-foreground transition-all"
              >
                Submit a Tool
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground/60">
            &copy; {year ?? ""} FounderStack Africa
          </p>
          <a
            href="https://x.com/founderstackafr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground/60 hover:text-foreground transition-all"
          >
            Twitter / X
          </a>
        </div>
      </div>
    </footer>
  )
}
