import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <section className="bg-background py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Skeleton className="h-4 w-24 mb-8" />

        {/* Main card */}
        <div className="shadow-card rounded-xl p-6 md:p-8">
          <div className="flex items-start gap-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
            <div className="flex-1">
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>

          {/* Description */}
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-4/5 mb-6" />

          {/* Metadata pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          <Skeleton className="h-px w-full my-6" />

          {/* At a glance */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>

          <Skeleton className="h-px w-full my-6" />

          {/* Use when / Skip when */}
          <div className="mb-5">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="mb-5">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </section>
  )
}
