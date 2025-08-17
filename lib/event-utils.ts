import type { Event, EventCategory, RSVPStatus } from "@/types/event"

function ensureDate(date: Date | string): Date {
  return typeof date === "string" ? new Date(date) : date
}

export function formatEventDate(startDate: Date | string, endDate?: Date | string): string {
  const start = ensureDate(startDate)
  const end = endDate ? ensureDate(endDate) : undefined

  const startDateStr = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  if (!end) {
    return `${startDateStr} at ${startTime}`
  }

  const endDateStr = end.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  const endTime = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  if (start.toDateString() === end.toDateString()) {
    return `${startDateStr} from ${startTime} to ${endTime}`
  }

  return `${startDateStr} ${startTime} - ${endDateStr} ${endTime}`
}

export function getEventCategoryColor(category: EventCategory): string {
  const colors = {
    meetup: "bg-blue-500",
    convention: "bg-purple-500",
    playtesting: "bg-green-500",
    workshop: "bg-orange-500",
    tournament: "bg-red-500",
    networking: "bg-teal-500",
    launch: "bg-pink-500",
    other: "bg-gray-500",
  }
  return colors[category] || colors.other
}

export function getEventStatusText(event: Event): string {
  const now = new Date()
  const eventStart = ensureDate(event.startDate)
  const eventEnd = event.endDate ? ensureDate(event.endDate) : eventStart

  if (now > eventEnd) {
    return "Past Event"
  } else if (now >= eventStart && now <= eventEnd) {
    return "Happening Now"
  } else if (event.rsvpDeadline && now > ensureDate(event.rsvpDeadline)) {
    return "RSVP Closed"
  } else if (event.maxAttendees && event.currentAttendees >= event.maxAttendees) {
    return "Full"
  } else {
    return "Open for RSVP"
  }
}

export function canUserRSVP(event: Event, userId?: string): boolean {
  if (!userId) return false

  const now = new Date()
  const eventStart = ensureDate(event.startDate)

  // Event has already started
  if (now >= eventStart) return false

  // RSVP deadline has passed
  if (event.rsvpDeadline && now > ensureDate(event.rsvpDeadline)) return false

  // User is already attending
  const userAttendee = event.attendees.find((a) => a.userId === userId)
  if (userAttendee && userAttendee.rsvpStatus === "going") return false

  return true
}

export function getUserRSVPStatus(event: Event, userId?: string): RSVPStatus | null {
  if (!userId) return null

  const attendee = event.attendees.find((a) => a.userId === userId)
  return attendee?.rsvpStatus || null
}
