import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const dynamicParams = false
import Link from "next/link"
import {
  ArrowLeft,
  ArrowSquareOut,
  CheckCircle,
  Clock,
  Warning,
  XCircle,
} from "@phosphor-icons/react/dist/ssr"
import { fetchToolBySlug, fetchAllTools, fetchToolsByCategory, fetchCategories } from "@/lib/notion"
import { AfricaBadge, AfricaNativeChip, FreeTierBadge, ToolBadgeChip } from "@/components/Badge"
import { CountryChip } from "@/components/CountryChip"
import { OutdatedBadge } from "@/components/OutdatedBadge"
import { ToolCard } from "@/components/ToolCard"
import { ShareButton } from "@/components/ShareButton"

import { COUNTRY_NAMES } from "@/lib/constants"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await fetchToolBySlug(slug)
  if (!tool) return {}

  const countries = tool.countries
    .map((c) => COUNTRY_NAMES[c] || c)
    .join(", ")
  const desc = tool.tagline
    ? `${tool.tagline}. Verified for ${countries || "African markets"}. Compare alternatives, read setup details, and see if ${tool.name} works for your startup.`
    : tool.description?.slice(0, 160)

  return {
    title: `${tool.name} - Startup Tool Review for African Founders`,
    description: desc,
    openGraph: {
      title: `${tool.name} | FounderStack Africa`,
      description: tool.tagline || tool.description?.slice(0, 160),
      url: `https://founderstackafrica.com/tool/${slug}`,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/tool/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  const tools = await fetchAllTools()
  return tools
    .filter((t) => t.slug)
    .map((t) => ({ slug: t.slug }))
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const [tool, categories] = await Promise.all([
    fetchToolBySlug(slug),
    fetchCategories(),
  ])
  if (!tool) notFound()

  // Find category name (use first category)
  const category = categories.find((c) => tool.categoryIds.includes(c.id))
  const categoryName = category?.name || tool.categoryName

  // Fetch similar tools from same category
  const similar = tool.categoryIds.length > 0
    ? (await fetchToolsByCategory(tool.categoryIds[0]))
        .filter((t) => t.id !== tool.id)
        .slice(0, 3)
    : []

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to tools
        </Link>

        {/* Main card */}
        <div className="shadow-card rounded-xl p-6 md:p-8">
          {/* Emoji + Name + Badge */}
          <div className="flex items-start gap-4 mb-4">
            {tool.emoji && (
              <span className="text-4xl md:text-5xl leading-none">{tool.emoji}</span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                  {tool.name}
                </h1>
                {tool.badge && <ToolBadgeChip badge={tool.badge} />}
              </div>
              {tool.tagline && (
                <p className="text-base text-muted-foreground leading-relaxed mt-1">
                  {tool.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium h-9 px-4 shadow-btn hover:bg-primary/90 transition-all"
            >
              Visit Website
              <ArrowSquareOut size={14} />
            </a>
            <ShareButton title={`${tool.name} - ${tool.tagline}`} text={`Check out ${tool.name} on FounderStack Africa: ${tool.tagline}`} />
            <AfricaBadge type={tool.africaCompatible} />
            {tool.africaNative && <AfricaNativeChip />}
          </div>

          {tool.affiliate && (
            <p className="text-xs text-muted-foreground/60 mb-4">
              Affiliate link. We may earn a commission at no cost to you.
            </p>
          )}

          {/* Description */}
          {tool.description && (
            <p className="text-sm leading-relaxed text-foreground mb-6">
              {tool.description}
            </p>
          )}

          {/* Metadata pills — inline */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-foreground mb-6">
            <div className="flex flex-wrap gap-1">
              {tool.countries.map((c) => (
                <CountryChip key={c} code={c} />
              ))}
            </div>
            {categoryName && (
              <>
                <span className="text-muted-foreground/30">&middot;</span>
                <Link
                  href={category ? `/category/${category.slug}` : "/tools"}
                  className="hover:text-foreground transition-colors"
                >
                  {categoryName}
                </Link>
              </>
            )}
            <span className="text-muted-foreground/30">&middot;</span>
            <FreeTierBadge tier={tool.freeTier} />
            <span className="text-muted-foreground/30">&middot;</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} />
              {tool.setupTime}
            </span>
          </div>

          <div className="h-px bg-border my-6" />

          {/* At a glance grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                Best for
              </p>
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
          </div>

          <div className="h-px bg-border my-6" />

          {/* Use when */}
          {tool.useWhen && (
            <div className="mb-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                Use when
              </p>
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
            <div className="mb-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                Skip when
              </p>
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
              className="rounded-lg p-3 mb-5"
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
            <div className="mb-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5">
                Alternatives
              </p>
              <p className="text-sm text-foreground">{tool.alternatives}</p>
            </div>
          )}

          {/* Verified date */}
          {tool.lastVerified && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={14} />
                Verified{" "}
                {new Date(tool.lastVerified).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <OutdatedBadge lastVerified={tool.lastVerified} />
            </div>
          )}
        </div>

        {/* Similar tools */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Explore similar tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {similar.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}

        {/* JSON-LD: SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: tool.name,
              description: tool.tagline || tool.description,
              url: tool.url,
              applicationCategory: "BusinessApplication",
              ...(tool.freeTier === "Yes" && {
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "USD",
                },
              }),
              aggregateRating: undefined,
              operatingSystem: "Web",
            }),
          }}
        />
      </div>
    </section>
  )
}
