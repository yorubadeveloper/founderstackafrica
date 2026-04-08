"use client"

import { useState } from "react"
import { Envelope, PaperPlaneTilt, CheckCircle } from "@phosphor-icons/react"

type Status = "idle" | "loading" | "success" | "error"

export function EmailCapture() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus("success")
        return
      }

      if (res.status === 429) {
        setErrorMessage("Too many requests — please wait a moment.")
        setStatus("error")
        return
      }

      const data = await res.json().catch(() => null)
      setErrorMessage(
        data?.error || "Something went wrong. Please try again."
      )
      setStatus("error")
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 animate-in fade-in duration-300">
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
            onChange={(e) => {
              setEmail(e.target.value)
              if (errorMessage) setErrorMessage("")
              if (status === "error") setStatus("idle")
            }}
            required
            disabled={status === "loading"}
            className="w-full h-9 rounded-lg bg-white pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none"
            style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)" }}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium h-9 px-3 shadow-btn hover:bg-primary/90 transition-all disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              Get updates
              <PaperPlaneTilt size={16} />
            </>
          )}
        </button>
      </div>
      {errorMessage && (
        <p className="text-xs text-destructive mt-2">{errorMessage}</p>
      )}
    </form>
  )
}
