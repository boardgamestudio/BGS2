"use client"

import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventCard } from "@/components/events/event-card"
import { Search, Plus, Calendar, User } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import type { Event } from "@/types/event"

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocationType, setSelectedLocationType] = useState("all")
  const [selectedEventType, setSelectedEventType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  useEffect(() => {
    const loadEvents = () => {
      const savedEvents = localStorage.getItem("bgs_events")
      if (savedEvents) {
        try {
          const parsedEvents = JSON.parse(savedEvents)
          setEvents(parsedEvents)
          console.log("[v0] Loaded events from localStorage:", parsedEvents.length)
        } catch (error) {
          console.error("[v0] Error parsing events from localStorage:", error)
          setEvents([])
        }
      } else {
        setEvents([])
      }
    }

    loadEvents()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bgs_events") {
        loadEvents()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const myEvents = events.filter((event) => user && event.organizerId === user.id)

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        event.organizerName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "all" || event.category === selectedCategory

      const matchesLocationType = selectedLocationType === "all" || event.location.type === selectedLocationType

      const matchesEventType = selectedEventType === "all" || event.type === selectedEventType

      return matchesSearch && matchesCategory && matchesLocationType && matchesEventType
    })
  }, [searchTerm, selectedCategory, selectedLocationType, selectedEventType])

  const sortedEvents = useMemo(() => {
    const sorted = [...filteredEvents]
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case "popular":
          return (b.currentAttendees || 0) - (a.currentAttendees || 0)
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "recent":
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        default:
          return 0
      }
    })
    return sorted
  }, [filteredEvents, sortBy])

  const upcomingEvents = sortedEvents.filter((event) => new Date(event.startDate) > new Date())
  const pastEvents = sortedEvents.filter((event) => new Date(event.startDate) <= new Date())

  const myUpcomingEvents = myEvents.filter((event) => new Date(event.startDate) > new Date())
  const myPastEvents = myEvents.filter((event) => new Date(event.startDate) <= new Date())

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setSelectedLocationType("all")
    setSelectedEventType("all")
  }

  const activeFilters = [
    ...(selectedCategory !== "all" ? [{ type: "category", value: selectedCategory, label: selectedCategory }] : []),
    ...(selectedLocationType !== "all"
      ? [{ type: "location", value: selectedLocationType, label: selectedLocationType }]
      : []),
    ...(selectedEventType !== "all" ? [{ type: "type", value: selectedEventType, label: selectedEventType }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Events"
        subtitle="Discover meetups, workshops, conventions, and other board game community events"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted-foreground">Connect with the board game community through events and gatherings</p>
          </div>
          <Link href="/events/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="browse">Browse Events</TabsTrigger>
            <TabsTrigger value="my-events" disabled={!user}>
              <User className="w-4 h-4 mr-2" />
              My Events ({user ? myEvents.length : 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search events..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="meetup">Meetups</SelectItem>
                        <SelectItem value="workshop">Workshops</SelectItem>
                        <SelectItem value="convention">Conventions</SelectItem>
                        <SelectItem value="launch">Launch Events</SelectItem>
                        <SelectItem value="tournament">Tournaments</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedLocationType} onValueChange={setSelectedLocationType}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="in-person">In Person</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="members-only">Members Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {activeFilters.length > 0 && (
                  <div className="flex items-center space-x-2 mt-4">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {activeFilters.map((filter, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span className="capitalize">{filter.label}</span>
                        <button
                          className="ml-1 hover:text-destructive"
                          onClick={() => {
                            if (filter.type === "category") setSelectedCategory("all")
                            else if (filter.type === "location") setSelectedLocationType("all")
                            else if (filter.type === "type") setSelectedEventType("all")
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="text-xs" onClick={clearAllFilters}>
                      Clear all
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="upcoming" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="upcoming" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past">Past Events ({pastEvents.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{upcomingEvents.length} upcoming events</p>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Soonest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Recently Added</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
                  ) : (
                    <div className="col-span-full">
                      <Card className="p-8 text-center">
                        <CardContent>
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No events scheduled yet</h3>
                          <p className="text-muted-foreground mb-4">
                            Be the first to create an event for the board game community.
                          </p>
                          <Link href="/events/create">
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Create the First Event
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past" className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{pastEvents.length} past events</p>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pastEvents.length > 0 ? (
                    pastEvents.map((event) => <EventCard key={event.id} event={event} />)
                  ) : (
                    <div className="col-span-full">
                      <Card className="p-8 text-center">
                        <CardContent>
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No past events</h3>
                          <p className="text-muted-foreground mb-4">
                            Past events will appear here once they've concluded.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="my-events" className="space-y-6">
            <Tabs defaultValue="my-upcoming" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="my-upcoming">Upcoming ({myUpcomingEvents.length})</TabsTrigger>
                <TabsTrigger value="my-past">Past ({myPastEvents.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="my-upcoming" className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{myUpcomingEvents.length} upcoming events you're organizing</p>
                  <Link href="/events/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Another Event
                    </Button>
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myUpcomingEvents.length > 0 ? (
                    myUpcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
                  ) : (
                    <div className="col-span-full">
                      <Card className="p-8 text-center">
                        <CardContent>
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                          <p className="text-muted-foreground mb-4">
                            Create your first event to start building community connections.
                          </p>
                          <Link href="/events/create">
                            <Button>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Your First Event
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="my-past" className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{myPastEvents.length} past events you organized</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myPastEvents.length > 0 ? (
                    myPastEvents.map((event) => <EventCard key={event.id} event={event} />)
                  ) : (
                    <div className="col-span-full">
                      <Card className="p-8 text-center">
                        <CardContent>
                          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No past events</h3>
                          <p className="text-muted-foreground">Your completed events will appear here.</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {(upcomingEvents.length > 0 || pastEvents.length > 0) && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Events
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
