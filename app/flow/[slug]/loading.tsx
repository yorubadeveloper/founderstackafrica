import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-3">
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-5 w-20 rounded-full mb-3" />
          <Skeleton className="h-4 w-full" />
        </div>

        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full mb-1.5" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
