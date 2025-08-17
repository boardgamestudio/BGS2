"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { AuthForms } from "@/components/auth/auth-forms"

export const AppHeader = React.memo(function AppHeader() {
  const { user, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BGS</span>
              </div>
              <h1 className="text-xl font-bold font-space-grotesk">Board Game Studio</h1>
            </Link>

            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">Welcome, {user.displayName}</span>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
            <AuthForms onSuccess={() => setShowAuthModal(false)} />
          </div>
        </div>
      )}
    </>
  )
})
