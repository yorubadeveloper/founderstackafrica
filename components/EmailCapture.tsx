"use client"

import { useState } from "react"
import { Envelope, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError("")

    try {
      // Placeholder for Brevo/Kit API integration
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-2 transition-opacity duration-300">
        <CheckCircle
          weight="fill"
          size={20}
          style={{ color: "rgb(var(--badge-green-text))" }}
        />
        <p className="text-sm text-foreground">You&apos;re in. Check your inbox.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Envelope
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-9 rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </div>
        <Button type="submit" disabled={loading} className="shrink-0">
          {loading ? (
            <>
              <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Get updates
              <PaperPlaneTilt size={16} />
            </>
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </form>
  )
}
