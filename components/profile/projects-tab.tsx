"use client"

import { useState, useEffect } from "react"
import { ProjectCard } from "@/components/projects/project-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types/project"

interface ProjectsTabProps {
  userId: string
}

export function ProjectsTab({ userId }: ProjectsTabProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserProjects = () => {
      try {
        const allProjects = JSON.parse(localStorage.getItem("bgs_projects") || "[]")
        const allUsers = JSON.parse(localStorage.getItem("bgs_users") || "[]")

        console.log("[v0] ===== DEBUGGING PROJECT ASSOCIATION =====")
        console.log("[v0] All projects in localStorage:", JSON.stringify(allProjects, null, 2))
        console.log("[v0] All users in localStorage:", JSON.stringify(allUsers, null, 2))
        console.log("[v0] Looking for projects with creatorId:", userId, "(type:", typeof userId, ")")

        let projectsUpdated = false
        const fixedProjects = allProjects.map((project: Project) => {
          console.log(
            `[v0] EXAMINING PROJECT: "${project.title}" with creatorId: "${project.creatorId}" (type: ${typeof project.creatorId})`,
          )

          // Find user by display name if creatorId is not a numeric ID
          if (project.creatorId && isNaN(Number(project.creatorId))) {
            console.log(`[v0] CreatorId "${project.creatorId}" is not numeric, attempting to fix...`)
            const matchingUser = allUsers.find(
              (user: any) =>
                user.displayName === project.creatorId ||
                user.username === project.creatorId ||
                user.email === project.creatorId,
            )

            if (matchingUser) {
              console.log(
                `[v0] FIXING PROJECT: "${project.title}" - changing creatorId from "${project.creatorId}" to "${matchingUser.id}"`,
              )
              projectsUpdated = true
              return {
                ...project,
                creatorId: matchingUser.id,
                creatorName: matchingUser.displayName,
                creatorUsername: matchingUser.username || matchingUser.id,
              }
            } else {
              console.log(`[v0] NO MATCHING USER FOUND for creatorId: "${project.creatorId}"`)
            }
          } else {
            console.log(`[v0] CreatorId "${project.creatorId}" is already numeric or valid`)
          }
          return project
        })

        // Save fixed projects back to localStorage
        if (projectsUpdated) {
          localStorage.setItem("bgs_projects", JSON.stringify(fixedProjects))
          console.log("[v0] Projects data migration completed - saved fixed projects to localStorage")
          console.log("[v0] Fixed projects:", JSON.stringify(fixedProjects, null, 2))
        }

        fixedProjects.forEach((project: Project, index: number) => {
          console.log(`[v0] === PROJECT ${index} COMPLETE DATA ===`)
          console.log(`[v0] Title: "${project.title}"`)
          console.log(`[v0] CreatorId: "${project.creatorId}" (type: ${typeof project.creatorId})`)
          console.log(`[v0] CreatorName: "${project.creatorName}"`)
          console.log(`[v0] CreatorUsername: "${project.creatorUsername}"`)
          console.log(`[v0] ID: "${project.id}"`)
          console.log(`[v0] === END PROJECT ${index} ===`)
        })

        const userProjects = fixedProjects.filter((project: Project) => {
          const match = project.creatorId === userId
          console.log(
            `[v0] FILTERING: Project "${project.title}": creatorId "${project.creatorId}" === userId "${userId}" ? ${match}`,
          )
          return match
        })

        console.log("[v0] FINAL RESULT: Loading projects for user:", userId, "Found:", userProjects.length, "projects")
        console.log("[v0] User projects found:", JSON.stringify(userProjects, null, 2))
        console.log("[v0] ===== END DEBUGGING PROJECT ASSOCIATION =====")
        setProjects(userProjects)
      } catch (error) {
        console.error("[v0] Error loading user projects:", error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadUserProjects()
  }, [userId])

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
        <p className="text-muted-foreground mb-4">Start sharing your board game projects with the community.</p>
        <Link href="/projects/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Project
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Projects ({projects.length})</h3>
        <Link href="/projects/create">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} showCreator={false} />
        ))}
      </div>
    </div>
  )
}
