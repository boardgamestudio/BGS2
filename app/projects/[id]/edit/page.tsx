"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { CreateProjectForm } from "@/components/projects/create-project-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem("bgs_projects") || "[]")
    const foundProject = projects.find((p) => p.id === params.id)

    if (!foundProject) {
      router.push("/projects")
      return
    }

    // Check if user is the project owner
    if (user?.id !== foundProject.creatorId) {
      router.push(`/projects/${params.id}`)
      return
    }

    setProject(foundProject)
    setIsLoading(false)
  }, [params.id, user, router])

  const handleProjectUpdate = (updatedProject) => {
    // Update project in localStorage
    const projects = JSON.parse(localStorage.getItem("bgs_projects") || "[]")
    const updatedProjects = projects.map((p) =>
      p.id === params.id ? { ...updatedProject, updatedAt: new Date().toISOString() } : p,
    )
    localStorage.setItem("bgs_projects", JSON.stringify(updatedProjects))

    // Redirect to project detail page
    router.push(`/projects/${params.id}`)
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!project) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Project not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Edit Project: {project.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateProjectForm
                currentUser={user}
                initialData={project}
                onProjectCreated={handleProjectUpdate}
                isEditing={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
