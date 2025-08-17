import type { Resource } from "@/types/resource"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ExternalLink, Mail } from "lucide-react"
import { getCategoryInfo, getTypeInfo, formatPrice } from "@/lib/resource-utils"
import Link from "next/link"

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const categoryInfo = getCategoryInfo(resource.category)
  const typeInfo = getTypeInfo(resource.type)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {categoryInfo?.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {typeInfo?.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">{resource.title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{resource.rating}</span>
              <span>({resource.reviewCount})</span>
            </div>
          </div>
          {resource.imageUrl && (
            <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
              <img
                src={resource.imageUrl || "/placeholder.svg"}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{resource.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {resource.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage src={resource.submittedByAvatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {resource.submittedByName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-muted-foreground">by {resource.submittedByName}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex items-center justify-between">
        <div className="text-sm font-medium">{formatPrice(resource.price)}</div>

        <div className="flex items-center gap-2">
          {resource.contact?.email && (
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Mail className="h-4 w-4" />
            </Button>
          )}
          {(resource.url || resource.contact?.website) && (
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" asChild>
            <Link href={`/resources/${resource.id}`}>View Details</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
