"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, PaperPlaneTilt } from "@phosphor-icons/react"
import { COUNTRIES } from "@/lib/constants"

type Tab = "tool" | "startup"
type Status = "idle" | "loading" | "success" | "error"

const SECTORS = [
  "Fintech",
  "Healthtech",
  "Edtech",
  "Agritech",
  "Logistics",
  "E-commerce",
  "SaaS",
  "Cleantech",
  "Proptech",
  "Insurtech",
  "Media & Entertainment",
  "HR & Recruitment",
  "Legal Tech",
  "Other",
]

const STAGES = [
  "Idea",
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C+",
  "Bootstrapped",
  "Acquired",
]

const FREE_TIER_OPTIONS = ["Yes", "No", "Trial only"]

const ALL_COUNTRY_OPTIONS = [
  ...COUNTRIES.map((c) => ({ code: c.code, label: `${c.flag} ${c.name}` })),
  { code: "Pan-African", label: "Pan-African" },
]

// ---------------------------------------------------------------------------
// Shared input styles
// ---------------------------------------------------------------------------

const inputClass =
  "w-full h-10 rounded-lg bg-white px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-60"

const inputShadow = {
  boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
}

const selectClass =
  "w-full h-10 rounded-lg bg-white px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-60 appearance-none cursor-pointer"

const labelClass = "block text-sm font-medium text-foreground mb-1.5"

const textareaClass =
  "w-full rounded-lg bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 disabled:pointer-events-none disabled:opacity-60 resize-none"

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SubmitForm() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "startup" ? "startup" : "tool"
  const [tab, setTab] = useState<Tab>(initialTab)
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Tool fields
  const [toolName, setToolName] = useState("")
  const [toolUrl, setToolUrl] = useState("")
  const [toolTagline, setToolTagline] = useState("")
  const [toolDescription, setToolDescription] = useState("")
  const [toolCountries, setToolCountries] = useState<string[]>([])
  const [toolFreeTier, setToolFreeTier] = useState("")
  const [toolEmail, setToolEmail] = useState("")

  // Startup fields
  const [startupName, setStartupName] = useState("")
  const [startupWebsite, setStartupWebsite] = useState("")
  const [startupTagline, setStartupTagline] = useState("")
  const [startupDescription, setStartupDescription] = useState("")
  const [startupSector, setStartupSector] = useState("")
  const [startupStage, setStartupStage] = useState("")
  const [startupCountry, setStartupCountry] = useState<string[]>([])
  const [startupFounded, setStartupFounded] = useState("")
  const [startupFounders, setStartupFounders] = useState("")
  const [startupEmail, setStartupEmail] = useState("")

  function resetError() {
    if (errorMessage) setErrorMessage("")
    if (status === "error") setStatus("idle")
  }

  function toggleCountry(
    code: string,
    selected: string[],
    setter: (val: string[]) => void,
  ) {
    setter(
      selected.includes(code)
        ? selected.filter((c) => c !== code)
        : [...selected, code],
    )
    resetError()
  }

  function handleTabSwitch(t: Tab) {
    if (status === "success") {
      setStatus("idle")
      setErrorMessage("")
    }
    setTab(t)
  }

  async function handleToolSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/submit/tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: toolName,
          url: toolUrl,
          tagline: toolTagline,
          description: toolDescription || undefined,
          countries: toolCountries,
          freeTier: toolFreeTier || undefined,
          email: toolEmail,
        }),
      })

      if (res.ok) {
        setStatus("success")
        return
      }

      const data = await res.json().catch(() => null)
      setErrorMessage(data?.error || "Something went wrong. Please try again.")
      setStatus("error")
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  async function handleStartupSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/submit/startup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: startupName,
          website: startupWebsite || undefined,
          tagline: startupTagline,
          description: startupDescription || undefined,
          sector: startupSector,
          stage: startupStage,
          country: startupCountry,
          founded: startupFounded ? Number(startupFounded) : undefined,
          founders: startupFounders || undefined,
          email: startupEmail,
        }),
      })

      if (res.ok) {
        setStatus("success")
        return
      }

      const data = await res.json().catch(() => null)
      setErrorMessage(data?.error || "Something went wrong. Please try again.")
      setStatus("error")
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  // Success state
  if (status === "success") {
    return (
      <div className="rounded-xl p-10 text-center animate-in fade-in duration-300" style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)" }}>
        <CheckCircle
          weight="fill"
          size={40}
          className="mx-auto mb-4"
          style={{ color: "rgb(var(--badge-green-text))" }}
        />
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Submission received
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          We will review your {tab === "tool" ? "tool" : "startup"} and reach out if we need anything.
        </p>
        <button
          onClick={() => {
            setStatus("idle")
            setErrorMessage("")
          }}
          className="text-sm font-medium text-foreground underline underline-offset-2 hover:text-foreground/80 transition-colors"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Pill tabs */}
      <div
        className="inline-flex items-center rounded-full p-1 mb-8"
        style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <button
          onClick={() => handleTabSwitch("tool")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
            tab === "tool"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Tool
        </button>
        <button
          onClick={() => handleTabSwitch("startup")}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
            tab === "startup"
              ? "bg-foreground text-background shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Startup
        </button>
      </div>

      {/* Tool form */}
      {tab === "tool" && (
        <form onSubmit={handleToolSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>
              Tool name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Paystack"
              value={toolName}
              onChange={(e) => { setToolName(e.target.value); resetError() }}
              required
              disabled={status === "loading"}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div>
            <label className={labelClass}>
              Website URL <span className="text-destructive">*</span>
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={toolUrl}
              onChange={(e) => { setToolUrl(e.target.value); resetError() }}
              required
              disabled={status === "loading"}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div>
            <label className={labelClass}>
              Tagline <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="One-line description"
              value={toolTagline}
              onChange={(e) => { setToolTagline(e.target.value); resetError() }}
              required
              maxLength={120}
              disabled={status === "loading"}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              placeholder="More detail about what the tool does (optional)"
              value={toolDescription}
              onChange={(e) => { setToolDescription(e.target.value); resetError() }}
              rows={3}
              disabled={status === "loading"}
              className={textareaClass}
              style={inputShadow}
            />
          </div>

          <div>
            <label className={labelClass}>
              Countries <span className="text-destructive">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Where does this tool work?
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_COUNTRY_OPTIONS.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  disabled={status === "loading"}
                  onClick={() => toggleCountry(c.code, toolCountries, setToolCountries)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all disabled:opacity-60 ${
                    toolCountries.includes(c.code)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    toolCountries.includes(c.code)
                      ? undefined
                      : { boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)" }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Free tier?</label>
            <select
              value={toolFreeTier}
              onChange={(e) => { setToolFreeTier(e.target.value); resetError() }}
              disabled={status === "loading"}
              className={selectClass}
              style={inputShadow}
            >
              <option value="">Select (optional)</option>
              {FREE_TIER_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Your email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={toolEmail}
              onChange={(e) => { setToolEmail(e.target.value); resetError() }}
              required
              disabled={status === "loading"}
              className={inputClass}
              style={inputShadow}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              So we can reach out if we have questions. Not stored publicly.
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background text-sm font-medium h-10 px-5 shadow-btn hover:bg-foreground/90 transition-all disabled:pointer-events-none disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit tool
                <PaperPlaneTilt size={16} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Startup form */}
      {tab === "startup" && (
        <form onSubmit={handleStartupSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>
              Startup name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Flutterwave"
              value={startupName}
              onChange={(e) => { setStartupName(e.target.value); resetError() }}
              required
              disabled={status === "loading"}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div>
            <label className={labelClass}>Website</label>
            <input
              type="url"
              placeholder="https://... (optional)"
              value={startupWebsite}
              onChange={(e) => { setStartupWebsite(e.target.value); resetError() }}
              disabled={status === "loading"}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div>
            <label className={labelClass}>
              Tagline <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              placeholder="One-line description"
              value={startupTagline}
              onChange={(e) => { setStartupTagline(e.target.value); resetError() }}
              required
              maxLength={120}
              disabled={status === "loading"}
              className={inputClass}
              style={inputShadow}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              placeholder="What does the startup do? (optional)"
              value={startupDescription}
              onChange={(e) => { setStartupDescription(e.target.value); resetError() }}
              rows={3}
              disabled={status === "loading"}
              className={textareaClass}
              style={inputShadow}
            />
          </div>

          <div>
            <label className={labelClass}>
              Sector <span className="text-destructive">*</span>
            </label>
            <select
              value={startupSector}
              onChange={(e) => { setStartupSector(e.target.value); resetError() }}
              required
              disabled={status === "loading"}
              className={selectClass}
              style={inputShadow}
            >
              <option value="">Select a sector</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Stage <span className="text-destructive">*</span>
            </label>
            <select
              value={startupStage}
              onChange={(e) => { setStartupStage(e.target.value); resetError() }}
              required
              disabled={status === "loading"}
              className={selectClass}
              style={inputShadow}
            >
              <option value="">Select a stage</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Country <span className="text-destructive">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-2">
              Where is this startup based or operating?
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_COUNTRY_OPTIONS.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  disabled={status === "loading"}
                  onClick={() => toggleCountry(c.code, startupCountry, setStartupCountry)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-all disabled:opacity-60 ${
                    startupCountry.includes(c.code)
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={
                    startupCountry.includes(c.code)
                      ? undefined
                      : { boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)" }
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Founded year</label>
              <input
                type="number"
                placeholder="e.g. 2020"
                value={startupFounded}
                onChange={(e) => { setStartupFounded(e.target.value); resetError() }}
                min={1900}
                max={new Date().getFullYear()}
                disabled={status === "loading"}
                className={inputClass}
                style={inputShadow}
              />
            </div>
            <div>
              <label className={labelClass}>Founders</label>
              <input
                type="text"
                placeholder="Founder names (optional)"
                value={startupFounders}
                onChange={(e) => { setStartupFounders(e.target.value); resetError() }}
                disabled={status === "loading"}
                className={inputClass}
                style={inputShadow}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Your email <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={startupEmail}
              onChange={(e) => { setStartupEmail(e.target.value); resetError() }}
              required
              disabled={status === "loading"}
              className={inputClass}
              style={inputShadow}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              So we can reach out if we have questions. Not stored publicly.
            </p>
          </div>

          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background text-sm font-medium h-10 px-5 shadow-btn hover:bg-foreground/90 transition-all disabled:pointer-events-none disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit startup
                <PaperPlaneTilt size={16} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
