import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const dynamicParams = false
import { fetchStartupsByStage } from "@/lib/notion"
import { StartupCard } from "@/components/StartupCard"
import { Breadcrumb } from "@/components/Breadcrumb"
import { slugify, unslugify } from "@/lib/utils"
import type { StartupStage } from "@/lib/types"
import Link from "next/link"

const ALL_STAGES: readonly StartupStage[] = [
  "Idea", "Pre-seed", "Seed", "Series A", "Series B",
  "Series C+", "Bootstrapped", "Acquired",
]

interface PageProps {
  params: Promise<{ stage: string }>
}

export async function generateStaticParams() {
  return ALL_STAGES.map((s) => ({ stage: slugify(s) }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { stage: stageSlug } = await params
  const stageName = unslugify(stageSlug, ALL_STAGES) || stageSlug
  return {
    title: `${stageName} African Startups`,
    description: `Browse African startups at the ${stageName.toLowerCase()} stage. Discover ${stageName.toLowerCase()} companies across fintech, healthtech, edtech, agritech, and more building across 20+ African countries.`,
    openGraph: {
      title: `${stageName} African Startups | FounderStack Africa`,
      description: `Browse African startups at the ${stageName.toLowerCase()} stage across multiple sectors and countries.`,
      url: `https://founderstackafrica.com/startups/stage/${stageSlug}`,
    },
    alternates: {
      canonical: `https://founderstackafrica.com/startups/stage/${stageSlug}`,
    },
  }
}

export default async function StagePage({ params }: PageProps) {
  const { stage: stageSlug } = await params
  const stageName = unslugify(stageSlug, ALL_STAGES)

  if (!stageName) notFound()

  const startups = await fetchStartupsByStage(stageName as StartupStage)

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Startups", href: "/startups" },
            { label: "Stages", href: "/startups" },
            { label: stageName },
          ]}
        />

        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Stage
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            {stageName}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {startups.length} startup{startups.length !== 1 ? "s" : ""} at this stage.
          </p>
        </div>

        {/* Other stages */}
        <div className="flex flex-wrap gap-2 mb-10">
          {ALL_STAGES.filter((s) => s !== stageName).map((s) => (
            <Link
              key={s}
              href={`/startups/stage/${slugify(s)}`}
              className="inline-flex items-center text-xs font-medium text-muted-foreground hover:text-foreground rounded-full px-2.5 py-1.5 shadow-btn transition-all"
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
              No startups listed at this stage yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
