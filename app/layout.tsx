import type { Metadata, Viewport } from "next"
import { Figtree } from "next/font/google"
import { GoogleAnalytics } from "@next/third-parties/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600"],
})

const SITE_URL = "https://founderstackafrica.com"
const SITE_NAME = "FounderStack Africa"
const SITE_DESCRIPTION =
  "The ultimate African startup starter pack. Find the right tools, discover startups, explore investors, and follow step-by-step guides built for founders across 20+ African countries."
const TWITTER_HANDLE = "@founderstackafr"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Tools That Work in Africa`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    // Core brand & concept
    "African startups",
    "African startup starter pack",
    "african startup starterpack",
    "startup starter pack Africa",
    "startup kit Africa",
    "startup toolkit Africa",
    "startup stack",
    "founder stack Africa",
    "FounderStack Africa",

    // Tools by country
    "startup tools Africa",
    "Nigeria startup tools",
    "Ghana startup tools",
    "Kenya startup tools",
    "South Africa startup tools",
    "Egypt startup tools",
    "Rwanda startup tools",
    "Morocco startup tools",
    "Tanzania startup tools",
    "Uganda startup tools",
    "Senegal startup tools",
    "Ethiopia startup tools",

    // Founder-oriented
    "founder tools",
    "African founders",
    "African entrepreneurs",
    "tools for African entrepreneurs",
    "resources for African founders",
    "best tools for African startups",
    "startup resources Africa",

    // Business tools
    "business tools Africa",
    "payment tools Africa",
    "Paystack alternatives",
    "Flutterwave alternatives",
    "African fintech tools",
    "SaaS Africa",
    "no-code tools Africa",
    "startup incorporation Africa",

    // Directory & ecosystem
    "African startup directory",
    "African startup list",
    "list of African startups",
    "top African startups",
    "African tech startups",
    "African startup ecosystem",
    "African tech ecosystem",
    "Pan-African startups",

    // Funding & investors
    "startup funding Africa",
    "venture capital Africa",
    "African startup investors",
    "investors in African startups",
    "VCs investing in Africa",
    "angel investors Africa",
    "startup grants Africa",
    "accelerators Africa",
    "startup accelerators in Nigeria",
    "startup accelerators in Kenya",

    // How-to / guides
    "startup guides Africa",
    "how to start a startup in Nigeria",
    "how to start a startup in Kenya",
    "how to start a startup in Ghana",
    "how to start a startup in South Africa",
    "how to register a company in Africa",
    "how to register a startup in Nigeria",
    "how to get funding for African startup",

    // Discovery-intent
    "discover African startups",
    "find startup tools in Africa",
    "African startup database",
    "African startup search",
  ],
  category: "Technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Tools That Work in Africa`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: `${SITE_NAME} | Tools That Work in Africa`,
    description: SITE_DESCRIPTION,
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
        <GoogleAnalytics gaId="G-F47311W1RH" />
      </body>
    </html>
  )
}
