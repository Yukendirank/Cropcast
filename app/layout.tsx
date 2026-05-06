import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "CropCast - Yield Prediction and AI Analytics",
  description: "AI-powered crop yield predictions and smart farming insights.",
  generator: "v0.app",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%230A4D3C/><path d=%22M50 30 C40 50, 40 65, 50 80 C60 65, 60 50, 50 30%22 fill=%234CAF50/><circle cx=%2250%22 cy=%2240%22 r=%226%22 fill=%23F59E0B/></svg>",
    apple: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%230A4D3C/><path d=%22M50 30 C40 50, 40 65, 50 80 C60 65, 60 50, 50 30%22 fill=%234CAF50/><circle cx=%2250%22 cy=%2240%22 r=%226%22 fill=%23F59E0B/></svg>",
  },
  manifest: "/site.webmanifest"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
