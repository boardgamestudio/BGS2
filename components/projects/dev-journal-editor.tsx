"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye, Lock } from "lucide-react"
import type { DevJournalEntry } from "@/types/project"

interface DevJournalEditorProps {
  entry?: DevJournalEntry
  onSave?: (entry: Partial<DevJournalEntry>) => void
  onCancel?: () => void
}

export function DevJournalEditor({ entry, onSave, onCancel }: DevJournalEditorProps) {
  const [formData, setFormData] = useState({
    title: entry?.title || "",
    content: entry?.content || "",
    isPublic: entry?.isPublic ?? true,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-space-grotesk">
          {entry ? "Edit Journal Entry" : "New Development Journal Entry"}
        </CardTitle>
        <CardDescription>
          Document your progress, share insights, and keep your followers updated on your project's journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Entry Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Playtesting Results, New Mechanic Ideas, Art Direction Update"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Share your development progress, challenges, breakthroughs, or thoughts..."
              rows={12}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tip: Use markdown formatting for better readability (bold, italic, lists, etc.)
            </p>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${formData.isPublic ? "bg-primary/10" : "bg-muted"}`}>
                {formData.isPublic ? (
                  <Eye className="w-4 h-4 text-primary" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <Label htmlFor="isPublic" className="text-base font-semibold">
                  {formData.isPublic ? "Public Entry" : "Private Entry"}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isPublic
                    ? "Visible to all project followers and community"
                    : "Only visible to you and project collaborators"}
                </p>
              </div>
            </div>
            <Switch
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
            />
          </div>

          {/* Preview Section */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center space-x-2 mb-3">
              <h4 className="font-semibold">Preview</h4>
              <Badge variant={formData.isPublic ? "default" : "secondary"}>
                {formData.isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{formData.title || "Entry Title"}</h3>
              <div className="flex items-center text-sm text-muted-foreground space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formData.content ? (
                  <div className="whitespace-pre-wrap line-clamp-3">{formData.content}</div>
                ) : (
                  <em>Content preview will appear here...</em>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{entry ? "Update Entry" : "Publish Entry"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
