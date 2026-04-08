import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt =
  "FounderStack Africa - Find the right tools, startups, and guides built for African markets"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const TOOL_CHIPS = [
  { emoji: "💳", name: "Paystack" },
  { emoji: "🏦", name: "Mono" },
  { emoji: "📦", name: "Termii" },
  { emoji: "🚀", name: "Flutterwave" },
  { emoji: "📊", name: "Piggyvest" },
  { emoji: "🌍", name: "Andela" },
  { emoji: "⚡", name: "Vercel" },
  { emoji: "📧", name: "Resend" },
]

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf9f6",
          padding: "60px 80px",
          position: "relative",
        }}
      >
        {/* Subtle top row of tool chips */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "48px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "800px",
          }}
        >
          {TOOL_CHIPS.map((tool) => (
            <div
              key={tool.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "9999px",
                backgroundColor: "#ffffff",
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04)",
                fontSize: "18px",
                color: "#18181b",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 500,
              }}
            >
              <span>{tool.emoji}</span>
              <span>{tool.name}</span>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0px",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#18181b",
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1.1,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            The founder stack
          </span>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#18181b",
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1.1,
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            for Africa
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "24px",
            color: "#71717a",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            maxWidth: "640px",
            lineHeight: 1.5,
            marginTop: "24px",
          }}
        >
          Find the right tools, connect with startups, and follow proven guides
          built for African markets.
        </p>

        {/* URL at bottom */}
        <p
          style={{
            fontSize: "16px",
            color: "#a1a1aa",
            fontFamily: "system-ui, sans-serif",
            marginTop: "40px",
            letterSpacing: "0.05em",
          }}
        >
          founderstackafrica.com
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}
