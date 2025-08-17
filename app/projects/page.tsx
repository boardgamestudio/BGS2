"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectCard } from "@/components/projects/project-card"
import { AppHeader } from "@/components/layout/app-header"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { Project } from "@/types/project"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [stageFilter, setStageFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated")

  useEffect(() => {
    const loadProjects = () => {
      try {
        const savedProjects = localStorage.getItem("bgs_projects")
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects)
          console.log("[v0] Loaded projects from localStorage:", parsedProjects)
          setProjects(parsedProjects)
          setFilteredProjects(parsedProjects)
        } else {
          console.log("[v0] No projects found in localStorage")
          setProjects([])
          setFilteredProjects([])
        }
      } catch (error) {
        console.error("[v0] Error loading projects:", error)
        setProjects([])
        setFilteredProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  useEffect(() => {
    let filtered = [...projects]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Stage filter
    if (stageFilter !== "all") {
      filtered = filtered.filter((project) => project.stage === stageFilter)
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (project) => project.category === categoryFilter || project.tags?.includes(categoryFilter),
      )
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "updated":
        default:
          return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      }
    })

    setFilteredProjects(filtered)
  }, [projects, searchTerm, stageFilter, categoryFilter, sortBy])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold font-space-grotesk mb-2">Project Showcase</h2>
            <p className="text-muted-foreground">
              Discover amazing board game projects from our community of designers and creators
            </p>
          </div>
          <Link href="/projects/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-10 bg-white border-gray-300 focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={stageFilter} onValueChange={setStageFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="concept">Concept</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="playtesting">Playtesting</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="party">Party Game</SelectItem>
                    <SelectItem value="cooperative">Cooperative</SelectItem>
                    <SelectItem value="card">Card Game</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">{filteredProjects.length} projects found</p>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="created">Newest First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {projects.length === 0 ? "No projects yet" : "No projects match your filters"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {projects.length === 0
                ? "Be the first to share your board game project with the community!"
                : "Try adjusting your search terms or filters to find more projects."}
            </p>
            {projects.length === 0 ? (
              <Link href="/projects/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </Button>
              </Link>
            ) : (
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStageFilter("all")
                  setCategoryFilter("all")
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProjects.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
