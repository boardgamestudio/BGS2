"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { CreateEventForm } from "@/components/events/create-event-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreateEventPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Create Event</h1>
          <p className="text-muted-foreground mb-8">Organize meetups, workshops, and community events</p>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">You need to be signed in to create events.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (eventData: any) => {
    setIsSubmitting(true)
    try {
      const eventWithMetadata = {
        ...eventData,
        id: Date.now().toString(),
        organizerId: user.id,
        organizerName: user.displayName || `${user.firstName} ${user.lastName}`,
        organizerUsername: user.username || user.id,
        organizerAvatar: user.profilePicture || "/placeholder.svg?height=40&width=40",
        currentAttendees: 0,
        maxAttendees: eventData.maxAttendees ? Number.parseInt(eventData.maxAttendees) : null,
        location: {
          type: eventData.locationType,
          venue: eventData.venue || "",
          address: eventData.address || "",
          city: eventData.city || "",
          state: eventData.state || "",
          country: eventData.country || "",
          onlineLink: eventData.onlineLink || "",
        },
        startDate: `${eventData.startDate}T${eventData.startTime}`,
        endDate: eventData.endDate && eventData.endTime ? `${eventData.endDate}T${eventData.endTime}` : null,
        rsvpDeadline: eventData.rsvpDeadline || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save to localStorage
      const existingEvents = JSON.parse(localStorage.getItem("bgs_events") || "[]")
      const updatedEvents = [...existingEvents, eventWithMetadata]
      localStorage.setItem("bgs_events", JSON.stringify(updatedEvents))

      console.log("[v0] Event created and saved to localStorage:", eventWithMetadata)

      // Simulate brief loading
      await new Promise((resolve) => setTimeout(resolve, 500))

      router.push("/events")
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/events")
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Create Event</h1>
        <p className="text-muted-foreground mb-8">Organize meetups, workshops, and community events</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CreateEventForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
