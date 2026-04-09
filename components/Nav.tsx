"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SubscribeModal } from "@/components/SubscribeModal"

export function Nav() {
  const pathname = usePathname()
  const [subscribeOpen, setSubscribeOpen] = useState(false)

  // Active tab detection — Explore is the default/fallback
  const isFlows = pathname.startsWith("/flow")
  const isStartups = pathname.startsWith("/startup")
  const isExplore = !isFlows && !isStartups

  return (
    <>
      <header
        className="sticky top-0 z-50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop: single row — logo | centered pills | Get updates */}
          <div className="hidden md:flex items-center justify-between h-14 mt-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 logo-tilt">
              <Image
                src="/logo.png"
                alt="FounderStack Africa"
                width={160}
                height={46}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Center: Segmented pill tabs */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <div className="nav-pill-tabs">
                <Link
                  href="/"
                  className={`nav-pill-tab ${isExplore ? "nav-pill-tab-active" : ""}`}
                >
                  Explore
                </Link>
                <Link
                  href="/flows"
                  className={`nav-pill-tab ${isFlows ? "nav-pill-tab-active" : ""}`}
                >
                  Flows
                </Link>
                <Link
                  href="/startups"
                  className={`nav-pill-tab ${isStartups ? "nav-pill-tab-active" : ""}`}
                >
                  Startups
                </Link>
              </div>
            </div>

            {/* Right: Get updates */}
            <button
              onClick={() => setSubscribeOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium h-8 px-4 shadow-btn hover:bg-primary/90 transition-all"
            >
              Get updates
            </button>
          </div>
        </div>

        {/* Mobile: pill tabs below logo */}
        <div className="flex md:hidden justify-center pb-2.5">
          <div className="nav-pill-tabs">
            <Link
              href="/"
              className={`nav-pill-tab ${isExplore ? "nav-pill-tab-active" : ""}`}
            >
              Explore
            </Link>
            <Link
              href="/flows"
              className={`nav-pill-tab ${isFlows ? "nav-pill-tab-active" : ""}`}
            >
              Flows
            </Link>
            <Link
              href="/startups"
              className={`nav-pill-tab ${isStartups ? "nav-pill-tab-active" : ""}`}
            >
              Startups
            </Link>
          </div>
        </div>
      </header>

      {/* Subscribe modal */}
      <SubscribeModal open={subscribeOpen} onOpenChange={setSubscribeOpen} />
    </>
  )
}
