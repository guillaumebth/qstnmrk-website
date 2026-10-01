import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { Toaster } from "sonner"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const description =
  "We exist to question everything: systems, society, power, culture, ourselves, and the absurdity of modern life."

// Aperçu du site quand on partage le lien (WhatsApp, iMessage, Instagram, X…)
export const metadata: Metadata = {
  metadataBase: new URL("https://www.qstnmrk.com"),
  title: "QSTNMRK?",
  description,
  openGraph: {
    title: "QSTNMRK?",
    description,
    url: "/",
    siteName: "QSTNMRK?",
    type: "website",
    images: [{ url: "/OG.png", width: 1200, height: 630, alt: "QSTNMRK?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "QSTNMRK?",
    description,
    images: ["/OG.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
