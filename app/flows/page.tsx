import type { Metadata } from "next"
import { fetchFlows } from "@/lib/notion"
import { FlowCard } from "@/components/FlowCard"

export const metadata: Metadata = {
  title: "Startup Guides for African Founders",
  description:
    "Step-by-step guides for registering a company, setting up payments, opening a business bank account, choosing hosting, and more. Each guide is built for founders across 20+ African countries.",
  openGraph: {
    title: "Startup Guides for African Founders | FounderStack Africa",
    description:
      "Step-by-step guides for incorporation, payments, banking, hosting, and more. Built for African founders.",
    url: "https://founderstackafrica.com/flows",
  },
  alternates: {
    canonical: "https://founderstackafrica.com/flows",
  },
}

export default async function FlowsPage() {
  const flows = await fetchFlows()

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
            Step-by-step
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-foreground mb-2">
            Founder flows
          </h1>
          <p className="text-lg text-muted-foreground">
            Practical guides for building a startup in Africa.
          </p>
        </div>

        {flows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {flows.map((flow) => (
              <FlowCard key={flow.id} flow={flow} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              No flows published yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
