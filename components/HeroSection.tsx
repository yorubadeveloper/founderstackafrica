import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { Button } from "@/components/ui/button"
import { EmailCapture } from "@/components/EmailCapture"

export function HeroSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
          The founder stack for Africa
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Curated tools and guides — vetted to work in Nigeria, Ghana, and Kenya. Updated regularly.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Button render={<a href="#categories" />} size="lg">
            Browse the stack
            <ArrowRight size={16} />
          </Button>
          <EmailCapture />
        </div>
      </div>
    </section>
  )
}
