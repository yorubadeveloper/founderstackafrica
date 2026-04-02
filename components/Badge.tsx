import {
  CheckCircle,
  Warning,
  XCircle,
  Globe,
} from "@phosphor-icons/react/dist/ssr"
import type { AfricaCompatible } from "@/lib/types"

interface AfricaBadgeProps {
  type: AfricaCompatible
  compact?: boolean
}

export function AfricaBadge({ type, compact = false }: AfricaBadgeProps) {
  const config = {
    Yes: {
      label: "Works in Africa",
      icon: CheckCircle,
      bgVar: "--badge-green-bg",
      textVar: "--badge-green-text",
    },
    Partial: {
      label: "Partial support",
      icon: Warning,
      bgVar: "--badge-amber-bg",
      textVar: "--badge-amber-text",
    },
    No: {
      label: "Limited in Africa",
      icon: XCircle,
      bgVar: "--badge-red-bg",
      textVar: "--badge-red-text",
    },
  }[type]

  const Icon = config.icon
  const iconSize = compact ? 10 : 12

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        compact ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
      style={{
        backgroundColor: `rgb(var(${config.bgVar}))`,
        color: `rgb(var(${config.textVar}))`,
      }}
    >
      <Icon weight="fill" size={iconSize} />
      {config.label}
    </span>
  )
}

interface AfricaNativeChipProps {
  compact?: boolean
}

export function AfricaNativeChip({ compact = false }: AfricaNativeChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        compact ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
      }`}
      style={{
        backgroundColor: "rgb(var(--badge-teal-bg))",
        color: "rgb(var(--badge-teal-text))",
      }}
    >
      <Globe size={12} />
      Africa-built
    </span>
  )
}

interface FreeTierBadgeProps {
  tier: "Yes" | "No" | "Trial only"
}

export function FreeTierBadge({ tier }: FreeTierBadgeProps) {
  if (tier === "Yes") {
    return (
      <span
        className="inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5"
        style={{
          backgroundColor: "rgb(var(--badge-green-bg))",
          color: "rgb(var(--badge-green-text))",
        }}
      >
        Free tier
      </span>
    )
  }
  if (tier === "Trial only") {
    return (
      <span
        className="inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5"
        style={{
          backgroundColor: "rgb(var(--badge-amber-bg))",
          color: "rgb(var(--badge-amber-text))",
        }}
      >
        Trial only
      </span>
    )
  }
  return (
    <span className="inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5 bg-muted text-muted-foreground">
      Paid
    </span>
  )
}

interface ToolBadgeChipProps {
  badge: "Featured" | "Verified" | "New"
}

export function ToolBadgeChip({ badge }: ToolBadgeChipProps) {
  if (badge === "Featured") {
    return (
      <span className="inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5 bg-foreground text-background">
        Featured
      </span>
    )
  }
  if (badge === "Verified") {
    return (
      <span className="inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5 bg-muted text-muted-foreground">
        Verified
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center text-xs font-medium rounded-full px-2 py-0.5"
      style={{
        backgroundColor: "rgb(var(--badge-amber-bg))",
        color: "rgb(var(--badge-amber-text))",
      }}
    >
      New
    </span>
  )
}
