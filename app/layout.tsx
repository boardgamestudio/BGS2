import type React from "react"
import type { Metadata } from "next"
import { Alegreya, Alegreya_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { ClientLayout } from "@/components/layout/client-layout"

const alegreya = Alegreya({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alegreya",
})

const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alegreya-sans",
})

export const metadata: Metadata = {
  title: "Board Game Studio - Ultimate Community for Board Game Designers",
  description:
    "Join the ultimate community for board game designers and creatives. Share projects, find jobs, attend events, and connect with like-minded creators.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${alegreya.variable} ${alegreyaSans.variable} dark`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>
      </body>
    </html>
  )
}
