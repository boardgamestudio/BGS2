"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import type { JobType, JobCategory, ExperienceLevel } from "@/types/job"
import type { Project } from "@/types/project"

export function PostJobForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [userProjects, setUserProjects] = useState<Project[]>([])

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: [] as string[],
    responsibilities: [] as string[],
    type: "full-time" as JobType,
    category: "design" as JobCategory,
    experienceLevel: "mid" as ExperienceLevel,
    location: "",
    isRemote: false,
    salaryRange: {
      min: 0,
      max: 0,
      currency: "USD",
    },
    skills: [] as string[],
    applyMethod: {
      type: "email" as "email" | "url",
      value: "",
    },
    associatedProjectId: "",
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  })

  const [newRequirement, setNewRequirement] = useState("")
  const [newResponsibility, setNewResponsibility] = useState("")
  const [newSkill, setNewSkill] = useState("")

  useEffect(() => {
    if (user) {
      const allProjects = JSON.parse(localStorage.getItem("bgs_projects") || "[]")
      const myProjects = allProjects.filter((project: Project) => project.creatorId === user.id)
      setUserProjects(myProjects)
    }
  }, [user])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }))
      setNewRequirement("")
    }
  }

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }))
  }

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }))
      setNewResponsibility("")
    }
  }

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const associatedProject = userProjects.find((p) => p.id === formData.associatedProjectId)

    const jobData = {
      ...formData,
      id: Date.now().toString(),
      posterId: user.id,
      posterName: user.displayName || `${user.firstName} ${user.lastName}`,
      posterUsername: user.username || user.id,
      associatedProjectTitle: associatedProject?.title,
      isActive: true,
      applicationCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Save to localStorage
    const existingJobs = JSON.parse(localStorage.getItem("bgs_jobs") || "[]")
    const updatedJobs = [...existingJobs, jobData]
    localStorage.setItem("bgs_jobs", JSON.stringify(updatedJobs))

    router.push("/jobs")
  }

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Please Sign In</CardTitle>
          <CardDescription>You need to be signed in to post a job.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Post a Job</CardTitle>
          <CardDescription>
            Connect with talented board game creators and find the perfect person for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {userProjects.length > 0 && (
              <div>
                <Label>Associate with Project (Optional)</Label>
                <Select
                  value={formData.associatedProjectId}
                  onValueChange={(value) => handleInputChange("associatedProjectId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project to associate this job with" />
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
                  Link this job to one of your projects to help candidates understand the context
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g. Board Game Artist, Game Designer, Marketing Manager"
                required
              />
            </div>

            <div>
              <Label htmlFor="company">Company/Organization *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Your company or organization name"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the role, what you're looking for, and what makes this opportunity exciting..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Job Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="art">Art & Illustration</SelectItem>
                    <SelectItem value="design">Game Design</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Experience Level *</Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => handleInputChange("experienceLevel", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="remote"
                  checked={formData.isRemote}
                  onCheckedChange={(checked) => handleInputChange("isRemote", checked)}
                />
                <Label htmlFor="remote">Remote work available</Label>
              </div>
            </div>

            <div>
              <Label>Salary Range (Optional)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={formData.salaryRange.min || ""}
                    onChange={(e) =>
                      handleInputChange("salaryRange", {
                        ...formData.salaryRange,
                        min: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={formData.salaryRange.max || ""}
                    onChange={(e) =>
                      handleInputChange("salaryRange", {
                        ...formData.salaryRange,
                        max: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <Select
                    value={formData.salaryRange.currency}
                    onValueChange={(value) =>
                      handleInputChange("salaryRange", {
                        ...formData.salaryRange,
                        currency: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label>Requirements</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a requirement"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" onClick={addRequirement}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.requirements.length > 0 && (
                  <div className="space-y-1">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm">{req}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Responsibilities</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a responsibility"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addResponsibility())}
                  />
                  <Button type="button" onClick={addResponsibility}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.responsibilities.length > 0 && (
                  <div className="space-y-1">
                    {formData.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm">{resp}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeResponsibility(index)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Required Skills</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a skill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>How to Apply *</Label>
              <div className="space-y-2">
                <Select
                  value={formData.applyMethod.type}
                  onValueChange={(value) =>
                    handleInputChange("applyMethod", {
                      ...formData.applyMethod,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="url">Application URL</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder={
                    formData.applyMethod.type === "email" ? "your-email@company.com" : "https://company.com/apply"
                  }
                  value={formData.applyMethod.value}
                  onChange={(e) =>
                    handleInputChange("applyMethod", {
                      ...formData.applyMethod,
                      value: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Post Job</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
