"use client"

import { useAuth } from "@/lib/auth-context"
import { CreateProjectForm } from "@/components/projects/create-project-form"
import { AppHeader } from "@/components/layout/app-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CreateProjectPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  console.log("[v0] CreateProjectPage - isLoading:", isLoading)
  console.log("[v0] CreateProjectPage - Current user:", user)
  console.log("[v0] CreateProjectPage - User exists:", !!user)
  console.log("[v0] CreateProjectPage - Component rendering")

  if (isLoading) {
    console.log("[v0] CreateProjectPage - Showing loading state")
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center pt-20">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Loading...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log("[v0] CreateProjectPage - No user found, showing sign in required")
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center pt-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You need to be signed in to create a project.</p>
              <Link href="/">
                <Button>Go to Homepage</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const canCreateProjects =
    user.membershipTypes.includes("designer") ||
    user.membershipTypes.includes("service") ||
    user.membershipTypes.includes("freelancer") ||
    user.membershipTypes.includes("learner")

  console.log("[v0] CreateProjectPage - Can create projects:", canCreateProjects)
  console.log("[v0] CreateProjectPage - User membership types:", user.membershipTypes)

  if (!canCreateProjects) {
    console.log("[v0] CreateProjectPage - User cannot create projects, showing upgrade required")
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex items-center justify-center pt-20">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upgrade Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You need to upgrade your membership to create projects.</p>
              <Link href="/profile">
                <Button>Upgrade Membership</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleProjectCreated = (projectId: string) => {
    console.log("[v0] CreateProjectPage - Project created with ID:", projectId)
    router.push(`/projects/${projectId}`)
  }

  console.log("[v0] CreateProjectPage - Rendering create project form")
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-alegreya mb-2">Create New Project</h1>
          <p className="text-muted-foreground">Share your board game project with the community</p>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <Link href="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="max-w-4xl">
          <CreateProjectForm onProjectCreated={handleProjectCreated} currentUser={user} />
        </div>
      </div>
    </div>
  )
}
