import type { Metadata } from "next"
import { fetchStartups } from "@/lib/notion"
import { StartupCard } from "@/components/StartupCard"

export const metadata: Metadata = {
  title: "African Startups Directory",
  description:
    "Discover innovative startups building across Africa. Browse by sector (fintech, healthtech, edtech, agritech), funding stage (pre-seed, seed, Series A), and country (Nigeria, Ghana, Kenya, South Africa, Egypt, Rwanda).",
  openGraph: {
    title: "African Startups Directory | FounderStack Africa",
    description:
      "Discover innovative startups building across Africa. Browse by sector, funding stage, and country.",
    url: "https://founderstackafrica.com/startups",
  },
  alternates: {
    canonical: "https://founderstackafrica.com/startups",
  },
}

export default async function StartupsPage() {
  const startups = await fetchStartups()

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Startups
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            African startups
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            Innovative companies building across the continent.
          </p>
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
              No startups listed yet. Check back soon.
            </p>
          </div>
        )}
      </div>

      {/* JSON-LD: ItemList */}
      {startups.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "African Startups Directory",
              description:
                "Directory of innovative startups building across Africa in fintech, healthtech, edtech, agritech, logistics, e-commerce, SaaS, and more.",
              numberOfItems: startups.length,
              itemListElement: startups.slice(0, 50).map((s, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: s.name,
                url: `https://founderstackafrica.com/startup/${s.slug}`,
              })),
            }),
          }}
        />
      )}
    </section>
  )
}
