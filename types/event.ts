export interface Event {
  id: string
  title: string
  description: string
  category: EventCategory
  type: EventType
  startDate: Date
  endDate?: Date
  location: EventLocation
  maxAttendees?: number
  currentAttendees: number
  rsvpDeadline?: Date
  tags: string[]
  organizerId: string
  organizerName: string
  organizerUsername: string
  organizerAvatar?: string
  coverImage?: string
  associatedProjectId?: string
  associatedProjectTitle?: string
  isPublic: boolean
  requiresApproval: boolean
  attendees: EventAttendee[]
  waitlist: EventAttendee[]
  createdAt: Date
  updatedAt: Date
}

export interface EventAttendee {
  userId: string
  username: string
  name: string
  avatar?: string
  rsvpStatus: RSVPStatus
  rsvpDate: Date
  notes?: string
}

export interface EventLocation {
  type: "online" | "in-person" | "hybrid"
  venue?: string
  address?: string
  city?: string
  state?: string
  country?: string
  onlineLink?: string
  timezone?: string
}

export type EventCategory =
  | "meetup"
  | "convention"
  | "playtesting"
  | "workshop"
  | "tournament"
  | "networking"
  | "launch"
  | "other"

export type EventType = "free" | "paid" | "members-only"

export type RSVPStatus = "going" | "maybe" | "not-going" | "waitlist"

export const EVENT_CATEGORIES = [
  { value: "meetup", label: "Meetup" },
  { value: "convention", label: "Convention" },
  { value: "playtesting", label: "Playtesting Session" },
  { value: "workshop", label: "Workshop" },
  { value: "tournament", label: "Tournament" },
  { value: "networking", label: "Networking" },
  { value: "launch", label: "Game Launch" },
  { value: "other", label: "Other" },
] as const
