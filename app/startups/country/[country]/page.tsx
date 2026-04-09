import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fetchStartupsByCountry } from "@/lib/notion"
import { StartupCard } from "@/components/StartupCard"
import { Breadcrumb } from "@/components/Breadcrumb"
import { COUNTRY_NAMES, COUNTRY_FLAGS, ALL_COUNTRIES_WITH_PAN } from "@/lib/constants"
import type { StartupCountry } from "@/lib/types"
import Link from "next/link"

interface PageProps {
  params: Promise<{ country: string }>
}

export async function generateStaticParams() {
  return ALL_COUNTRIES_WITH_PAN.map((c) => ({ country: c }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { country } = await params
  const countryName = COUNTRY_NAMES[country] || country
  return {
    title: `Startups in ${countryName}`,
    description: `Discover startups building in ${countryName}. Browse ${countryName} startups by sector (fintech, healthtech, edtech, agritech) and funding stage (pre-seed, seed, Series A, and beyond).`,
    openGraph: {
      title: `Startups in ${countryName} | FounderStack Africa`,
      description: `Discover startups building in ${countryName}. Browse by sector and funding stage.`,
      url: `https://founderstackafrica.com/startups/country/${country}`,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/startups/country/${country}`,
    },
  }
}

export default async function StartupCountryPage({ params }: PageProps) {
  const { country } = await params

  if (!ALL_COUNTRIES_WITH_PAN.includes(country as StartupCountry)) notFound()

  const countryName = COUNTRY_NAMES[country] || country
  const countryFlag = COUNTRY_FLAGS[country] || ""
  const startups = await fetchStartupsByCountry(country as StartupCountry)

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Startups", href: "/startups" },
            { label: "Countries", href: "/startups" },
            { label: `${countryFlag} ${countryName}` },
          ]}
        />

        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Country
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            {countryFlag} {countryName}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {startups.length} startup{startups.length !== 1 ? "s" : ""} in {countryName}.
          </p>
        </div>

        {/* Other countries */}
        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_COUNTRIES_WITH_PAN.filter((c) => c !== country).map((c) => (
            <Link
              key={c}
              href={`/startups/country/${c}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg px-2.5 py-1.5 shadow-btn transition-all"
            >
              {COUNTRY_FLAGS[c]} {COUNTRY_NAMES[c]}
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
              No startups listed in {countryName} yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
