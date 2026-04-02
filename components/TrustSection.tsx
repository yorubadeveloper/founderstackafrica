import {
  CheckCircle,
  Warning,
  XCircle,
} from "@phosphor-icons/react/dist/ssr"

export function TrustSection() {
  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground text-center mb-3">
          Transparency
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground text-center mb-12">
          What &ldquo;Works in Africa&rdquo; means
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Green - Works */}
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgb(var(--badge-green-bg))",
                  color: "rgb(var(--badge-green-text))",
                }}
              >
                <CheckCircle weight="fill" size={20} />
              </div>
            </div>
            <h3 className="font-semibold text-foreground">Works in Africa</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Accepts African payment methods, supports local currencies, and is
              fully operational in at least one African country.
            </p>
          </div>

          {/* Amber - Partial */}
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgb(var(--badge-amber-bg))",
                  color: "rgb(var(--badge-amber-text))",
                }}
              >
                <Warning weight="fill" size={20} />
              </div>
            </div>
            <h3 className="font-semibold text-foreground">Partial support</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Usable with workarounds. May require a US/UK entity, limited
              payout options, or have restricted features in Africa.
            </p>
          </div>

          {/* Red - Limited */}
          <div className="bg-card border border-border rounded-xl p-6 text-center space-y-3">
            <div className="flex justify-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "rgb(var(--badge-red-bg))",
                  color: "rgb(var(--badge-red-text))",
                }}
              >
                <XCircle weight="fill" size={20} />
              </div>
            </div>
            <h3 className="font-semibold text-foreground">Limited in Africa</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Not designed for African markets. Significant barriers to use;
              listed only for awareness or comparison.
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground/70 mt-10">
          Every tool has a &ldquo;last verified&rdquo; date. We update regularly.
        </p>
      </div>
    </section>
  )
}
