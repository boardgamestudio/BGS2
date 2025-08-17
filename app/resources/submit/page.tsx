"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { SubmitResourceForm } from "@/components/resources/submit-resource-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SubmitResourcePage() {
  const { user } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Submit Resource</h1>
          <p className="text-muted-foreground mb-8">Share valuable tools and services with the community</p>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">You need to be signed in to submit resources.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Submit Resource</h1>
        <p className="text-muted-foreground mb-8">Share valuable tools and services with the board game community</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SubmitResourceForm />
      </div>
    </div>
  )
}
