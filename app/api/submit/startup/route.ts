import { NextRequest, NextResponse } from "next/server"
import { createStartupSubmission } from "@/lib/notion"
import { resend } from "@/lib/resend"
import { SubmissionNotification } from "@/emails/SubmissionNotification"
import { COUNTRY_NAMES } from "@/lib/constants"

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter: max 3 requests per IP in 60 seconds
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }

  entry.count++
  return entry.count > 3
}

// ---------------------------------------------------------------------------
// POST /api/submit/startup
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 },
      )
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const name = typeof body.name === "string" ? body.name.trim() : ""
    const website = typeof body.website === "string" ? body.website.trim() : ""
    const tagline = typeof body.tagline === "string" ? body.tagline.trim() : ""
    const description = typeof body.description === "string" ? body.description.trim() : ""
    const sector = typeof body.sector === "string" ? body.sector.trim() : ""
    const stage = typeof body.stage === "string" ? body.stage.trim() : ""
    const country: string[] = Array.isArray(body.country) ? body.country : []
    const founded = typeof body.founded === "number" ? body.founded : undefined
    const founders = typeof body.founders === "string" ? body.founders.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Startup name is required." }, { status: 400 })
    }
    if (!tagline) {
      return NextResponse.json({ error: "Tagline is required." }, { status: 400 })
    }
    if (!sector) {
      return NextResponse.json({ error: "Sector is required." }, { status: 400 })
    }
    if (!stage) {
      return NextResponse.json({ error: "Stage is required." }, { status: 400 })
    }
    if (country.length === 0) {
      return NextResponse.json({ error: "Select at least one country." }, { status: 400 })
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 })
    }

    // Create Notion page
    await createStartupSubmission({
      name,
      website: website || undefined,
      tagline,
      description: description || undefined,
      sector,
      stage,
      country,
      founded,
      founders: founders || undefined,
    })

    // Send notification email
    const countryLabels = country.map((c) => COUNTRY_NAMES[c] || c).join(", ")
    const fields = [
      { label: "Name", value: name },
      ...(website ? [{ label: "Website", value: website }] : []),
      { label: "Tagline", value: tagline },
      ...(description ? [{ label: "Description", value: description }] : []),
      { label: "Sector", value: sector },
      { label: "Stage", value: stage },
      { label: "Country", value: countryLabels },
      ...(founded ? [{ label: "Founded", value: String(founded) }] : []),
      ...(founders ? [{ label: "Founders", value: founders }] : []),
    ]

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: "hello@founderstackafrica.com",
      subject: `New startup submission: ${name}`,
      react: SubmissionNotification({
        type: "startup",
        name,
        fields,
        submitterEmail: email,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[submit/startup] Error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
