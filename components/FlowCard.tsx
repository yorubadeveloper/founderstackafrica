import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { CountryChip } from "@/components/CountryChip"
import type { Flow } from "@/lib/types"

interface FlowCardProps {
  flow: Flow
}

export function FlowCard({ flow }: FlowCardProps) {
  return (
    <Link href={`/flow/${flow.slug}`} className="block h-full">
      <div className="shadow-card rounded-xl cursor-pointer h-full">
        <div className="p-5 flex flex-col gap-3 h-full">
          <div className="flex items-center gap-2">
            {flow.emoji && (
              <span className="text-xl leading-none">{flow.emoji}</span>
            )}
            <CountryChip code={flow.country} />
          </div>
          <h3 className="font-medium text-base text-foreground leading-snug">{flow.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{flow.description}</p>
          <div className="flex items-center gap-1 text-sm text-foreground font-medium mt-auto pt-1">
            Read guide
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  )
}
