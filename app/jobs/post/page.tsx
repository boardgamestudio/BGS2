"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { PostJobForm } from "@/components/jobs/post-job-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PostJobPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
          <p className="text-muted-foreground mb-8">Connect with talented board game creators</p>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">You need to be signed in to post jobs.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSave = async (jobData: any) => {
    setIsSubmitting(true)
    try {
      const jobWithUser = {
        ...jobData,
        posterId: user.id,
        posterName: user.name,
        posterUsername: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        applicationCount: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }

      console.log("[v0] Creating job:", jobWithUser)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to jobs page
      router.push("/jobs")
    } catch (error) {
      console.error("Error creating job:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/jobs")
  }

  // Check if user can post jobs (Designer or Service level)
  const canPostJobs = user.accountType === "designer" || user.accountType === "service"

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-muted-foreground mb-8">Connect with talented board game creators</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <PostJobForm onSave={handleSave} onCancel={handleCancel} canPostJobs={canPostJobs} />
      </div>
    </div>
  )
}
