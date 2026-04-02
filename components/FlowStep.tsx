interface FlowStepProps {
  stepNumber: number
  text: string
}

export function FlowStep({ stepNumber, text }: FlowStepProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-semibold">
        {stepNumber}
      </div>
      <div className="flex-1 pt-1">
        <p className="text-sm text-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
