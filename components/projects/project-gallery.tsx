"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, X, Plus, Eye } from "lucide-react"
import type { ProjectImage } from "@/types/project"

interface ProjectGalleryProps {
  images: ProjectImage[]
  canEdit?: boolean
  onAddImage?: (image: Omit<ProjectImage, "id" | "uploadedAt">) => void
  onRemoveImage?: (imageId: string) => void
  onUpdateCaption?: (imageId: string, caption: string) => void
}

export function ProjectGallery({
  images,
  canEdit = false,
  onAddImage,
  onRemoveImage,
  onUpdateCaption,
}: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null)
  const [newImageCaption, setNewImageCaption] = useState("")

  const handleAddImage = () => {
    // In a real app, this would handle file upload
    const mockImage = {
      url: "/placeholder-ws70z.png",
      caption: newImageCaption,
    }
    onAddImage?.(mockImage)
    setNewImageCaption("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-space-grotesk">Project Gallery</CardTitle>
          {canEdit && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Image to Gallery</DialogTitle>
                  <DialogDescription>Upload an image and add an optional caption</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                      <br />
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="caption">Caption (Optional)</Label>
                    <Input
                      id="caption"
                      value={newImageCaption}
                      onChange={(e) => setNewImageCaption(e.target.value)}
                      placeholder="Describe this image..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleAddImage}>Add Image</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
              <Eye className="w-8 h-8" />
            </div>
            <p>No images yet</p>
            {canEdit && <p className="text-sm">Add some images to showcase your project!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative">
                <div
                  className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.caption || "Project image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                {canEdit && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0"
                    onClick={() => onRemoveImage?.(image.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                {image.caption && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{image.caption}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Image Viewer Dialog */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedImage.caption || "Project Image"}</DialogTitle>
              </DialogHeader>
              <div className="max-h-[70vh] overflow-hidden rounded-lg">
                <img
                  src={selectedImage.url || "/placeholder.svg"}
                  alt={selectedImage.caption || "Project image"}
                  className="w-full h-full object-contain"
                />
              </div>
              {selectedImage.caption && <p className="text-sm text-muted-foreground">{selectedImage.caption}</p>}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
