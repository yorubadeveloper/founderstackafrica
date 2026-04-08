import Link from "next/link"
import { Lightning } from "@phosphor-icons/react/dist/ssr"
import { CountryChip } from "@/components/CountryChip"
import type { Startup } from "@/lib/types"

interface StartupCardProps {
  startup: Startup
}

export function StartupCard({ startup }: StartupCardProps) {
  return (
    <Link href={`/startup/${startup.slug}`} className="block h-full">
      <div className="shadow-card rounded-xl cursor-pointer group h-full">
        <div className="p-5 flex flex-col h-full">
          {/* Header: Emoji + Name + Stage */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {startup.emoji && (
                <span className="text-2xl leading-none">{startup.emoji}</span>
              )}
              <h3 className="font-medium text-base text-foreground">{startup.name}</h3>
            </div>
            <span className="shrink-0 text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              {startup.stage}
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mt-2">
            {startup.tagline}
          </p>

          {/* Sectors */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {startup.sector.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5"
              >
                {s}
              </span>
            ))}
          </div>

          {/* Countries */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {startup.country.map((c) => (
              <CountryChip key={c} code={c} />
            ))}
          </div>

          {/* Bottom */}
          <div className="mt-auto pt-3">
            <div className="h-px bg-border mb-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                {startup.founded && <span>{startup.founded}</span>}
                {startup.totalRaised && <span>{startup.totalRaised}</span>}
              </div>
              {startup.hiring && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: "rgb(var(--badge-green-bg))",
                    color: "rgb(var(--badge-green-text))",
                  }}
                >
                  <Lightning size={12} weight="fill" />
                  Hiring
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
