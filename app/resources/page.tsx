"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Plus, Star, ExternalLink, Download, BookOpen, Wrench } from "lucide-react"
import { AppHeader } from "@/components/layout/app-header"

type ResourceCategory = "design" | "manufacturing" | "marketing" | "tools" | "education"
type ResourceType = "tool" | "service" | "template" | "guide" | "software"

interface Resource {
  id: string
  title: string
  description: string
  category: ResourceCategory
  type: ResourceType
  url: string
  rating: number
  tags: string[]
  status: "approved" | "pending"
  submittedBy: string
  submittedAt: string
}

const resourceCategories = [
  { value: "design" as const, label: "Game Design" },
  { value: "manufacturing" as const, label: "Manufacturing" },
  { value: "marketing" as const, label: "Marketing" },
  { value: "tools" as const, label: "Tools & Software" },
  { value: "education" as const, label: "Education" },
]

const resourceTypes = [
  { value: "tool" as const, label: "Tool" },
  { value: "service" as const, label: "Service" },
  { value: "template" as const, label: "Template" },
  { value: "guide" as const, label: "Guide" },
  { value: "software" as const, label: "Software" },
]

const resources: Resource[] = []

function ResourceCard({ resource }: { resource: Resource }) {
  const getCategoryIcon = (category: ResourceCategory) => {
    switch (category) {
      case "design":
        return <BookOpen className="h-4 w-4" />
      case "tools":
        return <Wrench className="h-4 w-4" />
      case "manufacturing":
        return <Download className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(resource.category)}
            <CardTitle className="text-lg">{resource.title}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{resource.rating}</span>
          </div>
        </div>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{resourceCategories.find((c) => c.value === resource.category)?.label}</Badge>
          <Badge variant="outline">{resourceTypes.find((t) => t.value === resource.type)?.label}</Badge>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <Button asChild className="w-full">
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Resource
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

function SubmitResourceForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    category: "" as ResourceCategory | "",
    type: "" as ResourceType | "",
    tags: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Resource submitted:", formData)
    // Handle form submission
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a Resource</CardTitle>
        <CardDescription>Share a valuable resource with the Board Game Studio community</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Resource title"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the resource"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">URL</label>
            <Input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value: ResourceCategory) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {resourceCategories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value: ResourceType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Comma-separated tags (e.g., prototyping, digital, tools)"
            />
          </div>
          <Button type="submit" className="w-full">
            Submit Resource
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | "all">("all")
  const [selectedType, setSelectedType] = useState<ResourceType | "all">("all")
  const [showSubmitForm, setShowSubmitForm] = useState(false)

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesType = selectedType === "all" || resource.type === selectedType

    return matchesSearch && matchesCategory && matchesType && resource.status === "approved"
  })

  const featuredResources = resources.filter((r) => r.status === "approved" && r.rating >= 4.5).slice(0, 3)

  if (showSubmitForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => setShowSubmitForm(false)} className="mb-4">
            ← Back to Resources
          </Button>
        </div>
        <SubmitResourceForm />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Resources Directory"
        subtitle="Discover tools, services, and resources to help you create amazing board games"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-end mb-8">
          <Button onClick={() => (window.location.href = "/resources/submit")}>
            <Plus className="h-4 w-4 mr-2" />
            Submit Resource
          </Button>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select
                    value={selectedCategory}
                    onValueChange={(value: ResourceCategory | "all") => setSelectedCategory(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {resourceCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={(value: ResourceType | "all") => setSelectedType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {resourceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      setSelectedType("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">{filteredResources.length} Resources Found</h2>
                <div className="flex items-center gap-2">
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary">
                      {resourceCategories.find((c) => c.value === selectedCategory)?.label}
                    </Badge>
                  )}
                  {selectedType !== "all" && (
                    <Badge variant="secondary">{resourceTypes.find((t) => t.value === selectedType)?.label}</Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
                ) : (
                  <div className="col-span-full">
                    <Card className="text-center py-12">
                      <CardContent>
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No resources submitted yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Be the first to share a valuable resource with the board game community.
                        </p>
                        <Button onClick={() => (window.location.href = "/resources/submit")}>
                          <Plus className="w-4 h-4 mr-2" />
                          Submit the First Resource
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="featured" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Featured Resources
                </CardTitle>
                <CardDescription>Top-rated resources recommended by the community</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.length > 0 ? (
                featuredResources.map((resource) => <ResourceCard key={resource.id} resource={resource} />)
              ) : (
                <div className="col-span-full">
                  <Card className="text-center py-12">
                    <CardContent>
                      <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No featured resources yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Featured resources will appear here once the community starts rating submissions.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
