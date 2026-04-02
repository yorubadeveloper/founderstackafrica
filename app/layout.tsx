import type { Metadata } from "next"
import { Figtree } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme/ThemeProvider"
import { Nav } from "@/components/Nav"
import { Footer } from "@/components/Footer"
import { fetchCategories } from "@/lib/notion"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  display: "swap",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "FounderStack Africa | Tools for African Startup Founders",
  description:
    "Curated tools and guides vetted to work in Nigeria, Ghana, and Kenya. The operating system for African founders.",
  openGraph: {
    title: "FounderStack Africa | Tools for African Startup Founders",
    description:
      "Curated tools and guides vetted to work in Nigeria, Ghana, and Kenya. The operating system for African founders.",
    url: "https://founderstackafrica.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FounderStack Africa | Tools for African Startup Founders",
    description:
      "Curated tools and guides vetted to work in Nigeria, Ghana, and Kenya.",
  },
  alternates: {
    canonical: "https://founderstackafrica.com",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await fetchCategories()

  return (
    <html
      lang="en"
      className={`${figtree.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Nav categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
