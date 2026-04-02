"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row justify-between gap-8">
          {/* Left: Logo + tagline */}
          <div>
            <p className="font-semibold text-foreground">FounderStack Africa</p>
            <p className="text-sm text-muted-foreground mt-1">
              The operating system for African founders.
            </p>
          </div>

          {/* Right: Links */}
          <div className="flex gap-8">
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Browse
              </Link>
              <a
                href="/#flows"
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Flows
              </a>
            </div>
            <div className="space-y-2">
              <Link
                href="/country/NG"
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Nigeria
              </Link>
              <Link
                href="/country/GH"
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Ghana
              </Link>
              <Link
                href="/country/KE"
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Kenya
              </Link>
            </div>
            <div className="space-y-2">
              <Link
                href="/submit"
                className="block text-sm text-muted-foreground hover:text-foreground"
              >
                Submit a Tool
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FounderStack Africa. All rights reserved.
          </p>
          <a
            href="https://x.com/founderstackafr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Twitter / X
          </a>
        </div>
      </div>
    </footer>
  )
}
