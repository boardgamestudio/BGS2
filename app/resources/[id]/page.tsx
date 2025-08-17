"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Star, ExternalLink, Mail, Globe, Phone, ThumbsUp, Flag } from "lucide-react"
import { mockResources, getCategoryInfo, getTypeInfo, formatPrice } from "@/lib/resource-utils"
import type { ResourceReview } from "@/types/resource"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock reviews data
const mockReviews: ResourceReview[] = [
  {
    id: "1",
    resourceId: "1",
    userId: "user1",
    userName: "Alex Chen",
    userAvatar: "/placeholder.svg?height=32&width=32",
    rating: 5,
    comment: "Absolutely essential for prototyping! The physics engine makes testing so much more realistic.",
    createdAt: new Date("2024-01-10"),
    helpful: 12,
  },
  {
    id: "2",
    resourceId: "1",
    userId: "user2",
    userName: "Sarah Johnson",
    userAvatar: "/placeholder.svg?height=32&width=32",
    rating: 4,
    comment: "Great tool, though it has a bit of a learning curve. Worth the investment for serious designers.",
    createdAt: new Date("2024-01-08"),
    helpful: 8,
  },
]

interface ResourceDetailPageProps {
  params: { id: string }
}

export default function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const resource = mockResources.find((r) => r.id === params.id)
  if (!resource) {
    notFound()
  }

  const categoryInfo = getCategoryInfo(resource.category)
  const typeInfo = getTypeInfo(resource.type)
  const reviews = mockReviews.filter((r) => r.resourceId === resource.id)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingReview(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Review submitted:", { rating: newRating, comment: newReview })
    setNewReview("")
    setNewRating(5)
    setIsSubmittingReview(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/resources">← Back to Resources</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{categoryInfo?.label}</Badge>
                    <Badge variant="outline">{typeInfo?.label}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{resource.rating}</span>
                      <span>({resource.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={resource.submittedByAvatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {resource.submittedByName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>Submitted by {resource.submittedByName}</span>
                    </div>
                  </div>
                </div>
                {resource.imageUrl && (
                  <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <img
                      src={resource.imageUrl || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{resource.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{formatPrice(resource.price)}</div>

                <div className="flex items-center gap-2">
                  {resource.contact?.email && (
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  )}
                  {(resource.url || resource.contact?.website) && (
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews & Ratings</CardTitle>
              <CardDescription>What the community says about this resource</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setNewRating(star)} className="p-1">
                        <Star
                          className={`h-5 w-5 ${
                            star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review</label>
                  <Textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your experience with this resource..."
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={!newReview.trim() || isSubmittingReview}>
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </form>

              <Separator />

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {review.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{review.createdAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm mb-3">{review.comment}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          {(resource.contact?.email || resource.contact?.website || resource.contact?.phone) && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resource.contact.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${resource.contact.email}`} className="text-sm hover:underline">
                      {resource.contact.email}
                    </a>
                  </div>
                )}
                {resource.contact.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={resource.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                {resource.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${resource.contact.phone}`} className="text-sm hover:underline">
                      {resource.contact.phone}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Resource Details */}
          <Card>
            <CardHeader>
              <CardTitle>Resource Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span>{categoryInfo?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span>{typeInfo?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price:</span>
                <span>{formatPrice(resource.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submitted:</span>
                <span>{resource.submittedAt.toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
