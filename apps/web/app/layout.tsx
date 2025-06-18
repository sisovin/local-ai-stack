import { Geist, Geist_Mono } from "next/font/google"
import { Metadata } from "next"

import "@workspace/ui/globals.css"
import "@/lib/theme/theme-styles.css"
import { Providers } from "@/components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Local AI Stack - Futuristic AI Infrastructure",
  description: "A complete local AI infrastructure with DeepSeek R1, Qwen 3, and advanced backend services featuring cutting-edge cyberpunk design and real-time monitoring",
  keywords: ["AI", "Local LLM", "DeepSeek", "Qwen", "FastAPI", "Ollama", "Cyberpunk", "Futuristic UI", "Three.js"],
  authors: [{ name: "Local AI Stack Team" }],
  openGraph: {
    title: "Local AI Stack - Futuristic AI Infrastructure",
    description: "Next-generation AI Infrastructure with Cyberpunk Design",
    type: "website",
  },
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased tech-gradient min-h-screen`}
        suppressHydrationWarning
      >
        <div className="relative">
          {/* Animated background elements */}
          <div className="fixed inset-0 circuit-bg opacity-20 pointer-events-none" />
          <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent" />
          <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue to-transparent" />

          {/* Main content */}
          <Providers>
            <main className="relative z-10">
              {children}
            </main>
          </Providers>
        </div>

        {/* Ambient lighting effects */}
        <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none animate-pulse ambient-light-delayed" />
      </body>
    </html>
  )
}
