"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, MapPin, Users, Globe, Video, Share2, Heart, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import type { Event } from "@/types/event"
import { formatEventDate, getEventCategoryColor, getEventStatusText } from "@/lib/event-utils"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id as string
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [projectExists, setProjectExists] = useState<boolean | null>(null)

  useEffect(() => {
    if (eventId === "create") {
      window.location.href = "/events/create"
      return
    }
  }, [eventId])

  useEffect(() => {
    if (eventId === "create") {
      return
    }

    const loadEvent = () => {
      try {
        const storedEvents = localStorage.getItem("bgs_events")
        if (storedEvents) {
          const events: Event[] = JSON.parse(storedEvents)
          const foundEvent = events.find((e) => e.id === eventId)
          if (foundEvent) {
            setEvent(foundEvent)

            if (foundEvent.associatedProjectId) {
              const savedProjects = localStorage.getItem("bgs_projects")
              if (savedProjects) {
                const projects = JSON.parse(savedProjects)
                const exists = projects.some((p: any) => p.id === foundEvent.associatedProjectId)
                setProjectExists(exists)
              } else {
                setProjectExists(false)
              }
            }
          } else {
            setEvent(null)
          }
        }
      } catch (error) {
        console.error("Error loading event:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading event...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/events">
              <Button>Back to Events</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statusText = getEventStatusText(event)
  const isUpcoming = new Date(event.startDate) > new Date()
  const goingAttendees = event.attendees?.filter((a) => a.rsvpStatus === "going") || []
  const maybeAttendees = event.attendees?.filter((a) => a.rsvpStatus === "maybe") || []

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/events" className="hover:text-foreground">
            Events
          </Link>
          <span>/</span>
          <span>{event.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <div>
              {event.coverImage && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                  <img
                    src={event.coverImage || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant="secondary"
                      className={`${getEventCategoryColor(event.category)} text-white border-0`}
                    >
                      {event.category}
                    </Badge>
                    <Badge variant="outline">{statusText}</Badge>
                    {event.type !== "free" && <Badge variant="outline">{event.type}</Badge>}
                  </div>
                  <h1 className="text-3xl font-bold font-space-grotesk mb-2">{event.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={event.organizerAvatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">{event.organizerName?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <span>Organized by</span>
                    <Link href={`/profile/${event.organizerUsername}`} className="font-medium hover:text-foreground">
                      {event.organizerName}
                    </Link>
                    {event.associatedProjectTitle && projectExists && (
                      <>
                        <span>•</span>
                        <Link href={`/projects/${event.associatedProjectId}`} className="text-primary hover:underline">
                          {event.associatedProjectTitle}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {event.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Event Details Tabs */}
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attendees">Attendees ({event.currentAttendees || 0})</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {event.description?.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attendees" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Going ({goingAttendees.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {goingAttendees.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {goingAttendees.map((attendee) => (
                          <div key={attendee.userId} className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={attendee.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{attendee.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{attendee.name}</p>
                              <p className="text-xs text-muted-foreground">@{attendee.username}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No attendees yet</p>
                    )}
                  </CardContent>
                </Card>

                {maybeAttendees.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Maybe ({maybeAttendees.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {maybeAttendees.map((attendee) => (
                          <div key={attendee.userId} className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={attendee.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{attendee.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{attendee.name}</p>
                              <p className="text-xs text-muted-foreground">@{attendee.username}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="discussion" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Event Discussion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      No comments yet. Be the first to start the conversation!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* RSVP Card */}
            <Card>
              <CardHeader>
                <CardTitle>RSVP</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isUpcoming ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="w-full">Going</Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        Maybe
                      </Button>
                    </div>
                    <Button variant="ghost" className="w-full text-muted-foreground">
                      Can't Go
                    </Button>
                  </>
                ) : (
                  <p className="text-center text-muted-foreground py-4">This event has ended</p>
                )}

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Going</span>
                    <span className="font-medium">{goingAttendees.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Maybe</span>
                    <span className="font-medium">{maybeAttendees.length}</span>
                  </div>
                  {event.maxAttendees && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Spots left</span>
                      <span className="font-medium">{event.maxAttendees - (event.currentAttendees || 0)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{formatEventDate(event.startDate, event.endDate)}</p>
                    {event.rsvpDeadline && (
                      <p className="text-sm text-muted-foreground">
                        RSVP by {new Date(event.rsvpDeadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {event.location?.type === "online" ? (
                    <Video className="w-5 h-5 text-muted-foreground mt-0.5" />
                  ) : event.location?.type === "hybrid" ? (
                    <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                  ) : (
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  )}
                  <div>
                    {event.location?.type === "online" ? (
                      <p className="font-medium">Online Event</p>
                    ) : (
                      <>
                        <p className="font-medium">{event.location?.venue || "Venue TBD"}</p>
                        {event.location?.address && (
                          <p className="text-sm text-muted-foreground">{event.location.address}</p>
                        )}
                        {event.location?.city && event.location?.state && (
                          <p className="text-sm text-muted-foreground">
                            {event.location.city}, {event.location.state}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{event.currentAttendees || 0} attending</p>
                    {event.maxAttendees && (
                      <p className="text-sm text-muted-foreground">{event.maxAttendees} max capacity</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer */}
            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={event.organizerAvatar || "/placeholder.svg"} />
                    <AvatarFallback>{event.organizerName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{event.organizerName}</p>
                    <p className="text-sm text-muted-foreground">@{event.organizerUsername}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
