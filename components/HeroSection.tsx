import { ArrowRight } from "@phosphor-icons/react/dist/ssr"
import { EmailCapture } from "@/components/EmailCapture"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* Dot grid with fade mask */}
      <div
        className="dot-grid fade-mask absolute inset-0 z-0"
        aria-hidden="true"
      />

      {/* Radial glow */}
      <div className="hero-glow absolute inset-0 z-0" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
          Nigeria &middot; Ghana &middot; Kenya
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
          The founder stack
          <br className="hidden sm:block" />
          {" "}for Africa
        </h1>
        <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Curated tools and guides, vetted to work where you build. Updated regularly.
        </p>
        <div className="mt-10 flex flex-col items-center gap-5">
          <a
            href="#categories"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium h-10 px-4 hover:bg-primary/80 transition-all"
          >
            Browse the stack
            <ArrowRight size={16} />
          </a>
          <EmailCapture />
        </div>
      </div>
    </section>
  )
}
