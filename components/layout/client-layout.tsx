"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { SidebarNav } from "@/components/layout/sidebar-nav"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  console.log("[v0] ClientLayout - isLoading:", isLoading)
  console.log("[v0] ClientLayout - user:", user)
  console.log("[v0] ClientLayout - user exists:", !!user)

  if (isLoading) {
    console.log("[v0] ClientLayout - Showing loading state")
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  console.log("[v0] ClientLayout - Showing sidebar layout for all users")
  return (
    <div className="flex">
      <SidebarNav />
      <main className="flex-1 ml-16">{children}</main>
    </div>
  )
}
