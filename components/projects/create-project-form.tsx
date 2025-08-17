"use client"

import React from "react"
import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, Plus } from "lucide-react"
import type { ProjectStage, ProjectVisibility } from "@/types/project"
import { getStageDisplayName, commonTags } from "@/lib/project-utils"
import { getUserCapabilities } from "@/lib/user-capabilities"
import type { User } from "@/types/user"

interface CreateProjectFormProps {
  onSave?: (projectData: any) => void
  onCancel?: () => void
  onProjectCreated?: (projectId: string) => void // Added callback for successful project creation
  currentUser: User // Added current user prop for capabilities checking
  maxProjects?: number
  currentProjectCount?: number
  isEditing?: boolean
  initialData?: any
}

const MemoizedFormField = React.memo(
  ({
    label,
    children,
    required = false,
  }: {
    label: string
    children: React.ReactNode
    required?: boolean
  }) => (
    <div>
      <Label>
        {label} {required && "*"}
      </Label>
      {children}
    </div>
  ),
)

MemoizedFormField.displayName = "MemoizedFormField"

const MemoizedTagButton = React.memo(
  ({
    tag,
    isSelected,
    onToggle,
  }: {
    tag: string
    isSelected: boolean
    onToggle: (tag: string) => void
  }) => (
    <div
      className={`p-2 border rounded-lg cursor-pointer transition-colors text-center ${
        isSelected ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
      }`}
      onClick={() => onToggle(tag)}
    >
      <span className="text-sm">{tag}</span>
    </div>
  ),
)

MemoizedTagButton.displayName = "MemoizedTagButton"

export function CreateProjectForm({
  onSave,
  onCancel,
  onProjectCreated,
  currentUser,
  maxProjects,
  currentProjectCount,
  isEditing = false,
  initialData,
}: CreateProjectFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    description: initialData?.description || "",
    stage: (initialData?.stage || "concept") as ProjectStage,
    tags: initialData?.tags || ([] as string[]),
    visibility: (initialData?.visibility || "public") as ProjectVisibility,
    gameType: initialData?.gameType || ([] as string[]),
    playerCount: initialData?.playerCount || { min: 1, max: 4 },
    playTime: initialData?.playTime || { min: 30, max: 60 },
    targetAge: initialData?.targetAge || { min: 8 },
    complexity: initialData?.complexity || 3,
    lookingForPublisher: initialData?.lookingForPublisher || false,
    lookingForManufacturer: initialData?.lookingForManufacturer || false,
    lookingForPlaytesters: initialData?.lookingForPlaytesters || false,
    lookingForArtist: initialData?.lookingForArtist || false,
    lookingForDeveloper: initialData?.lookingForDeveloper || false,
    coverImage: initialData?.coverImage || "",
    galleryImages: initialData?.galleryImages || ([] as string[]),
    youtubeVideoUrl: initialData?.youtubeVideoUrl || "",
    sellSheetPdf: initialData?.sellSheetPdf || "",
    rulesPdf: initialData?.rulesPdf || "",
    printPlayPdf: initialData?.printPlayPdf || "",
    playOnlinePlatform: initialData?.playOnlinePlatform || "",
    playOnlineUrl: initialData?.playOnlineUrl || "",
  })

  const [customTag, setCustomTag] = useState("")

  const capabilities = useMemo(() => {
    const primaryMembershipType = currentUser.membershipTypes?.[0] || "learner"
    return getUserCapabilities(primaryMembershipType)
  }, [currentUser.membershipTypes])

  const actualMaxProjects = maxProjects ?? capabilities.maxProjects
  const actualCurrentCount = currentProjectCount ?? (currentUser.projects?.length || 0)
  const canCreateProject = isEditing || actualMaxProjects === -1 || actualCurrentCount < actualMaxProjects

  const handleInputChange = useCallback((field: string, value: string | boolean | { min: number; max: number }) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleTagToggle = useCallback((tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }))
  }, [])

  const handleAddCustomTag = useCallback(() => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, customTag.trim()],
      }))
      setCustomTag("")
    }
  }, [customTag, formData.tags])

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }, [])

  const handleAddGalleryImage = () => {
    // Placeholder for gallery image upload
    console.log("[v0] Add gallery image clicked")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Submitting project with data:", formData)
    console.log("[v0] Is editing:", isEditing)
    console.log("[v0] Current user:", currentUser)
    console.log("[v0] Current user ID:", currentUser.id, "(type:", typeof currentUser.id, ")")

    const projectData = {
      ...formData,
      id: isEditing ? initialData?.id : Date.now().toString(),
      creatorId: currentUser.id,
      creatorName: currentUser.displayName || `${currentUser.firstName} ${currentUser.lastName}`,
      creatorUsername: currentUser.username || currentUser.id,
      creatorAvatar: currentUser.profilePicture || "/placeholder.svg?height=40&width=40",
      isPublic: formData.visibility === "public",
      coverImage: formData.coverImage || "/placeholder.svg?height=200&width=300",
      gallery: initialData?.gallery || [],
      devJournal: initialData?.devJournal || [],
      followers: initialData?.followers || [],
      followerCount: initialData?.followerCount || 0,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    console.log(
      "[v0] Final project data with creatorId:",
      projectData.creatorId,
      "(type:",
      typeof projectData.creatorId,
      ")",
    )
    console.log("[v0] Full project data:", projectData)

    const existingProjects = JSON.parse(localStorage.getItem("bgs_projects") || "[]")
    let updatedProjects

    if (isEditing) {
      // Update existing project
      updatedProjects = existingProjects.map((project: any) => (project.id === projectData.id ? projectData : project))
      console.log("[v0] Updated existing project in localStorage")
    } else {
      // Add new project
      updatedProjects = [...existingProjects, projectData]
      console.log("[v0] Added new project to localStorage")

      // Update user's project list only when creating new project
      const updatedUser = {
        ...currentUser,
        projects: [...(currentUser.projects || []), projectData.id],
      }

      const existingUsers = JSON.parse(localStorage.getItem("bgs_users") || "[]")
      const updatedUsers = existingUsers.map((user: User) => (user.id === currentUser.id ? updatedUser : user))
      localStorage.setItem("bgs_users", JSON.stringify(updatedUsers))
      localStorage.setItem("bgs_current_user", JSON.stringify(updatedUser))
      console.log("[v0] Updated user data:", updatedUser)
    }

    localStorage.setItem("bgs_projects", JSON.stringify(updatedProjects))
    console.log("[v0] Saved projects to localStorage:", updatedProjects)

    onSave?.(projectData)
    onProjectCreated?.(projectData.id)
  }

  if (!currentUser) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-space-grotesk">Loading...</CardTitle>
          <CardDescription>Please wait while we load your user information.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!canCreateProject && !isEditing) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-space-grotesk">Project Limit Reached</CardTitle>
          <CardDescription>
            You've reached your project limit of {actualMaxProjects} projects. Upgrade your account to create more
            projects.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button className="mr-3">Upgrade Account</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">
            {isEditing ? `Edit Project: ${initialData?.title || "Project"}` : "Create New Project"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your project details and track your development progress"
              : "Share your board game project with the community and track your development progress"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Main Cover Image</Label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <Button type="button" variant="outline" className="mb-2 bg-transparent">
                  Upload Image
                </Button>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </div>

            <div>
              <Label>Gallery Images</Label>
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddGalleryImage}
                  className="w-full bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Gallery Images
                </Button>
              </div>
            </div>

            {/* Basic Info */}
            <MemoizedFormField label="Project Title" required>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter your project title"
                required
              />
            </MemoizedFormField>

            <MemoizedFormField label="Short Summary" required>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => handleInputChange("summary", e.target.value)}
                placeholder="Brief description of your project (1-2 sentences)"
                rows={2}
                required
              />
            </MemoizedFormField>

            <MemoizedFormField label="Detailed Description">
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Provide more details about your project, gameplay, theme, etc."
                rows={4}
              />
            </MemoizedFormField>

            <MemoizedFormField label="YouTube Video URL">
              <Input
                id="youtubeVideoUrl"
                value={formData.youtubeVideoUrl}
                onChange={(e) => handleInputChange("youtubeVideoUrl", e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=..."
              />
            </MemoizedFormField>

            {/* Project Stage */}
            <MemoizedFormField label="Current Stage" required>
              <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["concept", "development", "playtesting", "production", "published"] as ProjectStage[]).map(
                    (stage) => (
                      <SelectItem key={stage} value={stage}>
                        {getStageDisplayName(stage)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </MemoizedFormField>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Select tags that describe your project (helps with discovery)
              </p>

              {/* Common Tags */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-4">
                {commonTags.slice(0, 12).map((tag) => (
                  <MemoizedTagButton
                    key={tag}
                    tag={tag}
                    isSelected={formData.tags.includes(tag)}
                    onToggle={handleTagToggle}
                  />
                ))}
              </div>

              {/* Custom Tag Input */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Add custom tag"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomTag())}
                />
                <Button type="button" variant="outline" onClick={handleAddCustomTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Selected tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Game Specifications */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Game Specifications</h3>

              {/* Player Count */}
              <div className="grid grid-cols-2 gap-4">
                <MemoizedFormField label="Min Players">
                  <Input
                    id="minPlayers"
                    type="number"
                    min="1"
                    value={formData.playerCount.min}
                    onChange={(e) =>
                      handleInputChange("playerCount", {
                        ...formData.playerCount,
                        min: Number.parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </MemoizedFormField>
                <MemoizedFormField label="Max Players">
                  <Input
                    id="maxPlayers"
                    type="number"
                    min="1"
                    value={formData.playerCount.max}
                    onChange={(e) =>
                      handleInputChange("playerCount", {
                        ...formData.playerCount,
                        max: Number.parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </MemoizedFormField>
              </div>

              {/* Play Time */}
              <div className="grid grid-cols-2 gap-4">
                <MemoizedFormField label="Min Play Time (minutes)">
                  <Input
                    id="minTime"
                    type="number"
                    min="1"
                    value={formData.playTime.min}
                    onChange={(e) =>
                      handleInputChange("playTime", {
                        ...formData.playTime,
                        min: Number.parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </MemoizedFormField>
                <MemoizedFormField label="Max Play Time (minutes)">
                  <Input
                    id="maxTime"
                    type="number"
                    min="1"
                    value={formData.playTime.max}
                    onChange={(e) =>
                      handleInputChange("playTime", {
                        ...formData.playTime,
                        max: Number.parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </MemoizedFormField>
              </div>

              {/* Target Age */}
              <MemoizedFormField label="Target Age (minimum)">
                <Input
                  id="targetAge"
                  type="number"
                  min="1"
                  max="18"
                  value={formData.targetAge.min}
                  onChange={(e) =>
                    handleInputChange("targetAge", {
                      ...formData.targetAge,
                      min: Number.parseInt(e.target.value) || 8,
                    })
                  }
                />
              </MemoizedFormField>

              {/* Complexity */}
              <MemoizedFormField label="Complexity (1-5 scale)">
                <Select
                  value={formData.complexity.toString()}
                  onValueChange={(value) => handleInputChange("complexity", Number.parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Simple</SelectItem>
                    <SelectItem value="2">2 - Simple</SelectItem>
                    <SelectItem value="3">3 - Medium</SelectItem>
                    <SelectItem value="4">4 - Complex</SelectItem>
                    <SelectItem value="5">5 - Very Complex</SelectItem>
                  </SelectContent>
                </Select>
              </MemoizedFormField>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Game Files</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sell Sheet (PDF)</Label>
                  <Button type="button" variant="outline" className="w-full mt-2 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div>
                  <Label>Rules (PDF)</Label>
                  <Button type="button" variant="outline" className="w-full mt-2 bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div>
                <Label>Print & Play (PDF)</Label>
                <Button type="button" variant="outline" className="w-full mt-2 bg-transparent">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Play Online</h3>

              <div className="grid grid-cols-2 gap-4">
                <MemoizedFormField label="Platform">
                  <Select
                    value={formData.playOnlinePlatform}
                    onValueChange={(value) => handleInputChange("playOnlinePlatform", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tabletop-simulator">Tabletop Simulator</SelectItem>
                      <SelectItem value="board-game-arena">Board Game Arena</SelectItem>
                      <SelectItem value="tabletopia">Tabletopia</SelectItem>
                      <SelectItem value="roll20">Roll20</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </MemoizedFormField>
                <MemoizedFormField label="URL to game">
                  <Input
                    id="playOnlineUrl"
                    value={formData.playOnlineUrl}
                    onChange={(e) => handleInputChange("playOnlineUrl", e.target.value)}
                    placeholder="Link to online version"
                  />
                </MemoizedFormField>
              </div>
            </div>

            {/* Collaboration */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-semibold">Looking for Collaboration</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "lookingForPublisher", label: "Publisher" },
                  { key: "lookingForManufacturer", label: "Manufacturer" },
                  { key: "lookingForPlaytesters", label: "Playtesters" },
                  { key: "lookingForArtist", label: "Artist" },
                  { key: "lookingForDeveloper", label: "Developer" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={formData[key as keyof typeof formData] as boolean}
                      onCheckedChange={(checked) => handleInputChange(key, checked)}
                    />
                    <Label htmlFor={key}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <MemoizedFormField label="Project Visibility">
              <Select value={formData.visibility} onValueChange={(value) => handleInputChange("visibility", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Visible to everyone</SelectItem>
                  <SelectItem value="members-only">Members Only - Visible to BGS members</SelectItem>
                  <SelectItem value="private">Private - Only visible to you</SelectItem>
                </SelectContent>
              </Select>
            </MemoizedFormField>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{isEditing ? "Save Changes" : "Create Project"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
