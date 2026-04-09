import { NextRequest, NextResponse } from "next/server"
import { createToolSubmission } from "@/lib/notion"
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
// POST /api/submit/tool
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^https?:\/\/.+/

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
    const url = typeof body.url === "string" ? body.url.trim() : ""
    const tagline = typeof body.tagline === "string" ? body.tagline.trim() : ""
    const description = typeof body.description === "string" ? body.description.trim() : ""
    const countries: string[] = Array.isArray(body.countries) ? body.countries : []
    const categoryId = typeof body.categoryId === "string" ? body.categoryId.trim() : ""
    const freeTier = typeof body.freeTier === "string" ? body.freeTier.trim() : ""
    const email = typeof body.email === "string" ? body.email.trim() : ""

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Tool name is required." }, { status: 400 })
    }
    if (!url || !URL_RE.test(url)) {
      return NextResponse.json({ error: "A valid website URL is required." }, { status: 400 })
    }
    if (!tagline) {
      return NextResponse.json({ error: "Tagline is required." }, { status: 400 })
    }
    if (countries.length === 0) {
      return NextResponse.json({ error: "Select at least one country." }, { status: 400 })
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 })
    }

    // Create Notion page
    await createToolSubmission({
      name,
      url,
      tagline,
      description: description || undefined,
      countries,
      categoryId: categoryId || undefined,
      freeTier: freeTier || undefined,
    })

    // Send notification email
    const countryLabels = countries.map((c) => COUNTRY_NAMES[c] || c).join(", ")
    const fields = [
      { label: "Name", value: name },
      { label: "URL", value: url },
      { label: "Tagline", value: tagline },
      ...(description ? [{ label: "Description", value: description }] : []),
      { label: "Countries", value: countryLabels },
      ...(freeTier ? [{ label: "Free tier", value: freeTier }] : []),
    ]

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: "hello@founderstackafrica.com",
      subject: `New tool submission: ${name}`,
      react: SubmissionNotification({
        type: "tool",
        name,
        fields,
        submitterEmail: email,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[submit/tool] Error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    )
  }
}
