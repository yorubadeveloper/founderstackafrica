import { FunnelSimple } from "@phosphor-icons/react/dist/ssr"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({
  message = "No tools match your current filter.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FunnelSimple size={48} className="text-muted-foreground/40 mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
