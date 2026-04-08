import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchStartupsBySector, fetchStartups } from "@/lib/notion"
import { StartupCard } from "@/components/StartupCard"
import { Breadcrumb } from "@/components/Breadcrumb"
import { slugify, unslugify } from "@/lib/utils"
import type { StartupSector } from "@/lib/types"
import Link from "next/link"

const ALL_SECTORS: readonly StartupSector[] = [
  "Fintech", "Healthtech", "Edtech", "Agritech", "Logistics",
  "E-commerce", "SaaS", "Cleantech", "Proptech", "Insurtech",
  "Media & Entertainment", "HR & Recruitment", "Legal Tech", "Other",
]

interface PageProps {
  params: Promise<{ sector: string }>
}

export async function generateStaticParams() {
  return ALL_SECTORS.map((s) => ({ sector: slugify(s) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sector: sectorSlug } = await params
  const sectorName = unslugify(sectorSlug, ALL_SECTORS) || sectorSlug
  return {
    title: `${sectorName} Startups | FounderStack Africa`,
    description: `African startups in the ${sectorName} sector. Discover innovative companies building across the continent.`,
    openGraph: {
      title: `${sectorName} Startups | FounderStack Africa`,
      description: `African startups in the ${sectorName} sector.`,
      url: `https://founderstackafrica.com/startups/sector/${sectorSlug}`,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/startups/sector/${sectorSlug}`,
    },
  }
}

export default async function SectorPage({ params }: PageProps) {
  const { sector: sectorSlug } = await params
  const sectorName = unslugify(sectorSlug, ALL_SECTORS)

  if (!sectorName) notFound()

  const startups = await fetchStartupsBySector(sectorName as StartupSector)

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Startups", href: "/startups" },
            { label: "Sectors", href: "/startups" },
            { label: sectorName },
          ]}
        />

        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Sector
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            {sectorName}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {startups.length} startup{startups.length !== 1 ? "s" : ""} in this sector.
          </p>
        </div>

        {/* Other sectors */}
        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_SECTORS.filter((s) => s !== sectorName).map((s) => (
            <Link
              key={s}
              href={`/startups/sector/${slugify(s)}`}
              className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg px-2.5 py-1.5 shadow-btn transition-all"
            >
              {s}
            </Link>
          ))}
        </div>

        {startups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
          </div>
        ) : (
          <div className="shadow-card rounded-xl p-12 text-center">
            <p className="text-muted-foreground">
              No startups listed in this sector yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
