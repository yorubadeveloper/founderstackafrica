export function HeroSection() {
  return (
    <section className="bg-background pt-16 pb-6 md:pt-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
          The founder stack
          <br className="hidden sm:block" />
          {" "}for Africa
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Find the right tools, connect with startups, and follow proven guides built for African markets.
        </p>
      </div>
    </section>
  )
}
