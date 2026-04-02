import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Card, CardContent } from "@/components/ui/card"
import { CountryChip } from "@/components/CountryChip"
import type { Flow } from "@/lib/types"

interface FlowCardProps {
  flow: Flow
}

export function FlowCard({ flow }: FlowCardProps) {
  return (
    <Link href={`/flow/${flow.slug}`} className="snap-start flex-shrink-0 w-[280px] sm:w-auto">
      <Card className="bg-card border border-border rounded-xl hover:border-border/80 hover:shadow-sm dark:hover:shadow-none dark:hover:border-border/60 transition-all duration-150 cursor-pointer h-full">
        <CardContent className="p-5 flex flex-col gap-3">
          <CountryChip code={flow.country} />
          <h3 className="font-medium text-base text-foreground leading-snug">{flow.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{flow.description}</p>
          <div className="flex items-center gap-1 text-sm text-foreground font-medium mt-auto pt-1">
            Read guide
            <ArrowRight size={14} />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
