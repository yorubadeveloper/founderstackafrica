import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowSquareOut,
  Lightning,
} from "@phosphor-icons/react/dist/ssr"
import { fetchStartupBySlug, fetchStartups, fetchStartupsBySector } from "@/lib/notion"
import { CountryChip } from "@/components/CountryChip"
import { StartupCard } from "@/components/StartupCard"
import { ShareButton } from "@/components/ShareButton"
import { COUNTRY_NAMES } from "@/lib/constants"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const startup = await fetchStartupBySlug(slug)
  if (!startup) return {}

  const countries = startup.country
    .map((c) => COUNTRY_NAMES[c] || c)
    .join(", ")
  const sectors = startup.sector.join(", ")
  const desc = startup.tagline
    ? `${startup.tagline}. ${startup.stage} ${sectors} startup based in ${countries || "Africa"}. Learn about ${startup.name}, their funding, team, and more.`
    : startup.description?.slice(0, 160)

  return {
    title: `${startup.name} - ${sectors || "African"} Startup Profile`,
    description: desc,
    openGraph: {
      title: `${startup.name} | FounderStack Africa`,
      description: startup.tagline || startup.description?.slice(0, 160),
      url: `https://founderstackafrica.com/startup/${slug}`,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/startup/${slug}`,
    },
  }
}

export async function generateStaticParams() {
  const startups = await fetchStartups()
  return startups
    .filter((s) => s.slug)
    .map((s) => ({ slug: s.slug }))
}

export default async function StartupPage({ params }: Props) {
  const { slug } = await params
  const startup = await fetchStartupBySlug(slug)
  if (!startup) notFound()

  // Fetch similar startups by first sector
  const similar = startup.sector.length > 0
    ? (await fetchStartupsBySector(startup.sector[0]))
        .filter((s) => s.id !== startup.id)
        .slice(0, 3)
    : []

  const countryNames = startup.country
    .map((c) => COUNTRY_NAMES[c] || c)
    .join(", ")

  return (
    <section className="bg-background py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/startups"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          All startups
        </Link>

        {/* Main card */}
        <div className="shadow-card rounded-xl p-6 md:p-8">
          {/* Emoji + Name */}
          <div className="flex items-start gap-4 mb-4">
            {startup.emoji && (
              <span className="text-4xl md:text-5xl leading-none">{startup.emoji}</span>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                {startup.name}
              </h1>
              {startup.tagline && (
                <p className="text-base text-muted-foreground leading-relaxed mt-1">
                  {startup.tagline}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium h-9 px-4 shadow-btn hover:bg-primary/90 transition-all"
              >
                Visit Website
                <ArrowSquareOut size={14} />
              </a>
            )}
            <ShareButton title={`${startup.name} - ${startup.tagline}`} text={`Check out ${startup.name} on FounderStack Africa: ${startup.tagline}`} />
            {startup.hiring && (
              <span
                className="inline-flex items-center gap-1.5 text-sm font-medium rounded-full h-9 px-4"
                style={{
                  backgroundColor: "rgb(var(--badge-green-bg))",
                  color: "rgb(var(--badge-green-text))",
                }}
              >
                <Lightning size={14} weight="fill" />
                Hiring
              </span>
            )}
          </div>

          {/* Description */}
          {startup.description && (
            <p className="text-sm leading-relaxed text-foreground mb-6">
              {startup.description}
            </p>
          )}

          {/* Metadata pills — inline, like startups.gallery */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-muted-foreground">
            {countryNames && (
              <span className="inline-flex items-center gap-1">
                {startup.country.map((c) => (
                  <CountryChip key={c} code={c} />
                ))}
              </span>
            )}
            <span className="text-muted-foreground/30">&middot;</span>
            <span>{startup.stage}</span>
            {startup.totalRaised && (
              <>
                <span className="text-muted-foreground/30">&middot;</span>
                <span>{startup.totalRaised}</span>
              </>
            )}
            {startup.sector.map((s) => (
              <span key={s}>
                <span className="text-muted-foreground/30">&middot;</span>{" "}
                <Link
                  href={`/startups/sector/${encodeURIComponent(s)}`}
                  className="hover:text-foreground transition-colors"
                >
                  {s}
                </Link>
              </span>
            ))}
          </div>

          {/* Extra details */}
          {(startup.founded || startup.founders) && (
            <>
              <div className="h-px bg-border my-6" />
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                {startup.founded && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Founded
                    </p>
                    <span className="text-foreground">{startup.founded}</span>
                  </div>
                )}
                {startup.founders && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Founders
                    </p>
                    <span className="text-foreground">{startup.founders}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Similar startups */}
        {similar.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Explore similar startups
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {similar.map((s) => (
                <StartupCard key={s.id} startup={s} />
              ))}
            </div>
          </div>
        )}

        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: startup.name,
              description: startup.tagline || startup.description,
              ...(startup.website && { url: startup.website }),
              ...(startup.founded && { foundingDate: String(startup.founded) }),
              ...(startup.country.length > 0 && {
                areaServed: startup.country.map((c) => ({
                  "@type": "Place",
                  name: COUNTRY_NAMES[c] || c,
                })),
              }),
              ...(startup.sector.length > 0 && {
                keywords: startup.sector.join(", "),
              }),
            }),
          }}
        />
      </div>
    </section>
  )
}
