"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Settings, Tag, X } from "lucide-react"
import { GROUP_CATEGORIES } from "@/types/group"
import type { GroupCategory, GroupType } from "@/types/group"
import type { Project } from "@/types/project"

interface CreateGroupFormProps {
  onSubmit: (groupData: any) => void
  onCancel: () => void
}

export function CreateGroupForm({ onSubmit, onCancel }: CreateGroupFormProps) {
  const { user } = useAuth()
  const [userProjects, setUserProjects] = useState<Project[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general" as GroupCategory, // Added default value
    type: "public" as GroupType,
    location: "",
    maxMembers: "",
    requiresApproval: false,
    isPublic: true,
    tags: [] as string[],
    newTag: "",
    rules: [] as string[],
    newRule: "",
    associatedProjectId: "none", // Updated default value to be a non-empty string
  })

  useEffect(() => {
    if (user) {
      const allProjects = JSON.parse(localStorage.getItem("bgs_projects") || "[]")
      const myProjects = allProjects.filter((project: Project) => project.creatorId === user.id)
      setUserProjects(myProjects)
    }
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const associatedProject = userProjects.find((p) => p.id === formData.associatedProjectId)
    const groupData = {
      ...formData,
      associatedProjectTitle: associatedProject?.title,
    }

    onSubmit(groupData)
  }

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addRule = () => {
    if (formData.newRule.trim()) {
      setFormData((prev) => ({
        ...prev,
        rules: [...prev.rules, prev.newRule.trim()],
        newRule: "",
      }))
    }
  }

  const removeRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {userProjects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Association</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Associate with Project (Optional)</Label>
              <Select
                value={formData.associatedProjectId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, associatedProjectId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a project to associate this group with" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project association</SelectItem> {/* Updated value prop */}
                  {userProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Link this group to one of your projects to help members understand the context
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Group Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your group's purpose and what members can expect..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: GroupCategory) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="City, State or 'Online'"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Privacy & Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="type">Group Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: GroupType) => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can find and join</SelectItem>
                <SelectItem value="private">Private - Invite only, hidden from search</SelectItem>
                <SelectItem value="invite-only">Invite Only - Visible but requires invitation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maxMembers">Maximum Members (Optional)</Label>
            <Input
              id="maxMembers"
              type="number"
              value={formData.maxMembers}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxMembers: e.target.value }))}
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>

          {formData.type === "public" && (
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requiresApproval">Require Join Approval</Label>
                <p className="text-sm text-muted-foreground">Manually approve each join request</p>
              </div>
              <Switch
                id="requiresApproval"
                checked={formData.requiresApproval}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requiresApproval: checked }))}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={formData.newTag}
              onChange={(e) => setFormData((prev) => ({ ...prev, newTag: e.target.value }))}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>

          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Group Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Group Rules (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={formData.newRule}
              onChange={(e) => setFormData((prev) => ({ ...prev, newRule: e.target.value }))}
              placeholder="Add a group rule..."
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRule())}
            />
            <Button type="button" onClick={addRule} variant="outline">
              Add
            </Button>
          </div>

          {formData.rules.length > 0 && (
            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">{index + 1}.</span>
                  <span className="text-sm flex-1">{rule}</span>
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Group</Button>
      </div>
    </form>
  )
}
