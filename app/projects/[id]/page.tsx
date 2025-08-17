"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Download, ExternalLink, Play, FileText } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types/project"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/layout/app-header"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const loadProject = () => {
      try {
        const savedProjects = localStorage.getItem("bgs_projects")
        if (savedProjects) {
          const projects: Project[] = JSON.parse(savedProjects)
          const foundProject = projects.find((p) => p.id === params.id)
          setProject(foundProject || null)
        }
      } catch (error) {
        console.error("Error loading project:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProject()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading project...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist.</p>
          <Link href="/projects">
            <Button>Back to Projects</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === project.creatorId

  const getCreatorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatPlayerCount = (playerCount: any) => {
    if (typeof playerCount === "object" && playerCount?.min !== undefined) {
      if (playerCount.max && playerCount.max !== playerCount.min) {
        return `${playerCount.min}-${playerCount.max}`
      }
      return `${playerCount.min}+`
    }
    return playerCount || "2-4"
  }

  const formatPlayTime = (playTime: any) => {
    if (typeof playTime === "object" && playTime?.min !== undefined) {
      if (playTime.max && playTime.max !== playTime.min) {
        return `${playTime.min}-${playTime.max} min`
      }
      return `${playTime.min}+ min`
    }
    return playTime || "60-90 min"
  }

  const formatTargetAge = (targetAge: any) => {
    if (typeof targetAge === "object" && targetAge?.min !== undefined) {
      if (targetAge.max && targetAge.max !== targetAge.min) {
        return `${targetAge.min}-${targetAge.max}`
      }
      return `${targetAge.min}+`
    }
    return targetAge || "12+"
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Project Details</h1>
        <p className="text-muted-foreground mb-8">View project information and resources</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section with Title Overlay */}
            <div className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden">
              <img
                src={project.coverImage || "/placeholder.svg?height=400&width=800&query=fantasy game artwork"}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-blue-600 text-white">
                    {project.genre || "Strategy"}
                  </Badge>
                  {isOwner && (
                    <Link href={`/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">{project.title}</h2>
                <p className="text-lg text-gray-200 max-w-2xl">{project.summary}</p>
              </div>
            </div>

            {/* About this Game Design */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">About this Game Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {project.description ||
                    "An immersive fantasy strategy game where players lead magical kingdoms through epic quests and tactical battles. Features innovative spell-casting mechanics and dynamic storytelling."}
                </p>
              </CardContent>
            </Card>

            {/* Downloads - Only show if files exist */}
            {(project.sellSheet || project.rules || project.printAndPlay) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Downloads</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {project.sellSheet && (
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Sell Sheet</p>
                          <p className="text-sm text-muted-foreground">Marketing document for the game</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  {project.rules && (
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Rules</p>
                          <p className="text-sm text-muted-foreground">Complete rule document</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  {project.printAndPlay && (
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Print and Play</p>
                          <p className="text-sm text-muted-foreground">Printable version of the game</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Play Online - Only show if play URL exists */}
            {project.playOnlineUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Play Online</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">Play on {project.playOnlinePlatform || "TTS"}</p>
                        <p className="text-sm text-muted-foreground">Click to play online</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={project.playOnlineUrl} target="_blank">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Play
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Gallery - Only show if gallery images exist */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {project.galleryImages.map((image, i) => (
                      <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Gallery image ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Showcase - Only show if video URL exists */}
            {project.youtubeVideoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Video Showcase</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${project.youtubeVideoUrl.split("v=")[1]?.split("&")[0] || project.youtubeVideoUrl.split("/").pop()}`}
                      title="Game video"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Game Design Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Design Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Genre</span>
                  <Badge variant="outline">{project.genre || "Strategy"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Players</span>
                  <span>{formatPlayerCount(project.playerCount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span>{formatTargetAge(project.targetAge)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Play Time</span>
                  <span>{formatPlayTime(project.playTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Complexity</span>
                  <span>{project.complexity || "Medium"}</span>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Looking for Publisher</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {project.lookingForPublisher ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Looking for Manufacturer</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {project.lookingForManufacturer ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Creator */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg" alt={project.creatorName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getCreatorInitials(project.creatorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/profile/${project.creatorId}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {project.creatorName}
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seeking Collaborators - Only show if collaboration flags are set */}
            {(project.lookingForPublisher ||
              project.lookingForManufacturer ||
              project.lookingForPlaytesters ||
              project.lookingForArtist) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seeking Collaborators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.lookingForArtist && (
                      <Badge variant="outline" className="mr-2">
                        Artist
                      </Badge>
                    )}
                    {project.lookingForPublisher && (
                      <Badge variant="outline" className="mr-2">
                        Publisher
                      </Badge>
                    )}
                    {project.lookingForManufacturer && (
                      <Badge variant="outline" className="mr-2">
                        Manufacturer
                      </Badge>
                    )}
                    {project.lookingForPlaytesters && <Badge variant="outline">Playtester</Badge>}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <Link href="#" className="text-sm hover:text-primary transition-colors">
                    BoardGameGeek
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <Link href="#" className="text-sm hover:text-primary transition-colors">
                    Crowdfunding Page
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
