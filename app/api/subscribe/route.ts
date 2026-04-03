import { NextRequest, NextResponse } from "next/server"
import { resend } from "@/lib/resend"
import { WelcomeEmail } from "@/emails/WelcomeEmail"

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
// POST /api/subscribe
// ---------------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests — please wait a moment." },
        { status: 429 }
      )
    }

    // Validate body
    const body = await req.json().catch(() => null)
    const email = typeof body?.email === "string" ? body.email.trim() : ""

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 })
    }

    // 1. Add contact to Resend audience
    try {
      await resend.contacts.create({
        email,
        audienceId: process.env.RESEND_AUDIENCE_ID!,
        unsubscribed: false,
      })
    } catch (err: unknown) {
      // 409 = contact already exists — not an error for the user
      const status = (err as { statusCode?: number })?.statusCode
      if (status !== 409) throw err
    }

    // 2. Send welcome email
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "You're in — welcome to FounderStack Africa",
      react: WelcomeEmail({}),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[subscribe] Error:", err)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
