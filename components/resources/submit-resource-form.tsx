"use client"

import type React from "react"
import { useAuth } from "@/hooks/useAuth" // Import useAuth hook

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { resourceCategories, resourceTypes } from "@/lib/resource-utils"
import type { ResourceCategory, ResourceType } from "@/types/resource"

export function SubmitResourceForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "" as ResourceCategory,
    type: "" as ResourceType,
    url: "",
    priceType: "free" as "free" | "paid" | "freemium",
    priceAmount: "",
    priceCurrency: "$",
    contactEmail: "",
    contactWebsite: "",
    contactPhone: "",
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth() // Use useAuth hook to get user data

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 10) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const resourceWithUser = {
        ...formData,
        tags,
        id: `resource-${Date.now()}`,
        submittedBy: user?.id || "anonymous",
        submittedByName: user?.name || "Anonymous",
        submittedByAvatar: user?.avatar || "/placeholder.svg?height=32&width=32",
        submittedAt: new Date(),
        status: "pending" as const,
        rating: 0,
        reviewCount: 0,
      }

      console.log("[v0] Resource submitted:", resourceWithUser)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "" as ResourceCategory,
        type: "" as ResourceType,
        url: "",
        priceType: "free",
        priceAmount: "",
        priceCurrency: "$",
        contactEmail: "",
        contactWebsite: "",
        contactPhone: "",
      })
      setTags([])

      // Redirect to resources page
      window.location.href = "/resources"
    } catch (error) {
      console.error("Error submitting resource:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a Resource</CardTitle>
        <CardDescription>
          Share a useful tool, service, or resource with the board game community. All submissions are reviewed before
          being published.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Resource Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., TableTop Simulator"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this resource does and how it helps board game creators..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category *</Label>
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
                      <div>
                        <div className="font-medium">{category.label}</div>
                        <div className="text-xs text-muted-foreground">{category.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type *</Label>
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

          <div className="space-y-4">
            <Label>Pricing</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={formData.priceType}
                onValueChange={(value: "free" | "paid" | "freemium") => setFormData({ ...formData, priceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="freemium">Freemium</SelectItem>
                </SelectContent>
              </Select>

              {formData.priceType === "paid" && (
                <>
                  <Select
                    value={formData.priceCurrency}
                    onValueChange={(value) => setFormData({ ...formData, priceCurrency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">USD ($)</SelectItem>
                      <SelectItem value="€">EUR (€)</SelectItem>
                      <SelectItem value="£">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    value={formData.priceAmount}
                    onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                  />
                </>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm" disabled={!newTag.trim() || tags.length >= 10}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Add up to 10 tags to help people find your resource</p>
          </div>

          <div className="space-y-4">
            <Label>Contact Information (Optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactWebsite">Website</Label>
                <Input
                  id="contactWebsite"
                  type="url"
                  value={formData.contactWebsite}
                  onChange={(e) => setFormData({ ...formData, contactWebsite: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Resource"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
