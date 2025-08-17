import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, MapPin, Users, Globe, Video } from "lucide-react"
import Link from "next/link"
import type { Event } from "@/types/event"
import { formatEventDate, getEventCategoryColor, getEventStatusText } from "@/lib/event-utils"

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const statusText = getEventStatusText(event)
  const isUpcoming = new Date(event.startDate) > new Date()

  return (
    <Card className="hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group cursor-pointer">
      {event.coverImage && (
        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
          <img
            src={event.coverImage || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className={`${getEventCategoryColor(event.category)} text-white border-0 shadow-sm`}
              >
                {event.category}
              </Badge>
              <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors duration-200">
                {statusText}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-200">
              <Link href={`/events/${event.id}`}>{event.title}</Link>
            </CardTitle>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="w-5 h-5 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
            <AvatarImage src={event.organizerAvatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">{event.organizerName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">by {event.organizerName}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{formatEventDate(event.startDate, event.endDate)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            {event.location.type === "online" ? (
              <Video className="w-4 h-4 text-muted-foreground" />
            ) : event.location.type === "hybrid" ? (
              <Globe className="w-4 h-4 text-muted-foreground" />
            ) : (
              <MapPin className="w-4 h-4 text-muted-foreground" />
            )}
            <span>
              {event.location.type === "online"
                ? "Online Event"
                : event.location.type === "hybrid"
                  ? `${event.location.venue} + Online`
                  : `${event.location.venue}, ${event.location.city}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{event.currentAttendees}</span> attending
              {event.maxAttendees && ` (${event.maxAttendees} max)`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {event.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs hover:bg-primary/10 transition-colors duration-200">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 2 && (
              <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors duration-200">
                +{event.tags.length - 2}
              </Badge>
            )}
          </div>

          {isUpcoming && (
            <Button
              size="sm"
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              RSVP
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
