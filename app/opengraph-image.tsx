import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "FounderStack Africa - Curated tools for African startup founders"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
          backgroundColor: "#ffffff",
          padding: "60px",
        }}
      >
        {/* Logo area - text-based since we can't easily load custom fonts in edge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "0px",
            }}
          >
            <span
              style={{
                fontSize: "72px",
                fontStyle: "italic",
                color: "#1a1a1a",
                fontFamily: "Georgia, serif",
              }}
            >
              founder
            </span>
            <span
              style={{
                fontSize: "72px",
                fontWeight: 700,
                color: "#1a1a1a",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              stack
            </span>
          </div>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#1a1a1a",
              fontFamily: "system-ui, sans-serif",
              marginTop: "-16px",
            }}
          >
            Africa
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "80px",
            height: "2px",
            backgroundColor: "#e5e5e5",
            marginTop: "40px",
            marginBottom: "32px",
          }}
        />

        {/* Tagline */}
        <p
          style={{
            fontSize: "28px",
            color: "#737373",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Curated tools and guides, vetted to work in Nigeria, Ghana, and Kenya.
        </p>

        {/* URL */}
        <p
          style={{
            fontSize: "18px",
            color: "#a3a3a3",
            fontFamily: "system-ui, sans-serif",
            marginTop: "24px",
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
