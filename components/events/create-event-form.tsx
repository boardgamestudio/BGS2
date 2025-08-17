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
import { Calendar, MapPin, Users, Clock, X } from "lucide-react"
import { EVENT_CATEGORIES } from "@/types/event"
import type { EventCategory, EventType } from "@/types/event"
import type { Project } from "@/types/project"

interface CreateEventFormProps {
  onSubmit: (eventData: any) => void
  onCancel: () => void
}

export function CreateEventForm({ onSubmit, onCancel }: CreateEventFormProps) {
  const { user } = useAuth()
  const [userProjects, setUserProjects] = useState<Project[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "general" as EventCategory, // Updated default value
    type: "free" as EventType,
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    locationType: "in-person",
    venue: "",
    address: "",
    city: "",
    state: "",
    country: "",
    onlineLink: "",
    timezone: "America/New_York",
    maxAttendees: "",
    rsvpDeadline: "",
    requiresApproval: false,
    isPublic: true,
    tags: [] as string[],
    newTag: "",
    associatedProjectId: "",
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
    const eventData = {
      ...formData,
      associatedProjectTitle: associatedProject?.title,
    }

    onSubmit(eventData)
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
                  <SelectValue placeholder="Select a project to associate this event with" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No project association</SelectItem>
                  {userProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Link this event to one of your projects to help attendees understand the context
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your event..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: EventCategory) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Event Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: EventType) => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="members-only">Members Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date & Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Date & Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time (Optional)</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rsvpDeadline">RSVP Deadline (Optional)</Label>
            <Input
              id="rsvpDeadline"
              type="datetime-local"
              value={formData.rsvpDeadline}
              onChange={(e) => setFormData((prev) => ({ ...prev, rsvpDeadline: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Location Type</Label>
            <Select
              value={formData.locationType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, locationType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in-person">In Person</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.locationType === "in-person" || formData.locationType === "hybrid") && (
            <>
              <div>
                <Label htmlFor="venue">Venue Name</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => setFormData((prev) => ({ ...prev, venue: e.target.value }))}
                  placeholder="Enter venue name"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                    placeholder="Country"
                  />
                </div>
              </div>
            </>
          )}

          {(formData.locationType === "online" || formData.locationType === "hybrid") && (
            <div>
              <Label htmlFor="onlineLink">Online Meeting Link</Label>
              <Input
                id="onlineLink"
                value={formData.onlineLink}
                onChange={(e) => setFormData((prev) => ({ ...prev, onlineLink: e.target.value }))}
                placeholder="Zoom, Discord, etc."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attendees & Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Attendee Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxAttendees">Maximum Attendees (Optional)</Label>
            <Input
              id="maxAttendees"
              type="number"
              value={formData.maxAttendees}
              onChange={(e) => setFormData((prev) => ({ ...prev, maxAttendees: e.target.value }))}
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="requiresApproval">Require RSVP Approval</Label>
              <p className="text-sm text-muted-foreground">Manually approve each RSVP before confirming attendance</p>
            </div>
            <Switch
              id="requiresApproval"
              checked={formData.requiresApproval}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requiresApproval: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isPublic">Public Event</Label>
              <p className="text-sm text-muted-foreground">Anyone can discover and RSVP to this event</p>
            </div>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublic: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
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

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  )
}
