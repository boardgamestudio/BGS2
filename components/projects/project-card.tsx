import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import type { Project } from "@/types/project"
import { getStageVariant, getStageDisplayName } from "@/lib/project-utils"

interface ProjectCardProps {
  project: Project
  showCreator?: boolean
}

export function ProjectCard({ project, showCreator = true }: ProjectCardProps) {
  const getCreatorInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="group hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
      <div className="aspect-video bg-muted rounded-t-lg overflow-hidden relative">
        {project.coverImage ? (
          <img
            src={project.coverImage || "/placeholder.svg"}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
            <div className="text-4xl font-bold text-muted-foreground opacity-50 group-hover:opacity-70 transition-opacity duration-300">
              {project.title[0]}
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity duration-200">
          <Badge variant={getStageVariant(project.stage)} className="shadow-sm">
            {getStageDisplayName(project.stage)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200 truncate">
              <Link href={`/projects/${project.id}`}>{project.title}</Link>
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">{project.summary}</CardDescription>
          </div>
        </div>

        {showCreator && (
          <div className="flex items-center space-x-2 pt-2">
            <Avatar className="w-6 h-6 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
              <AvatarImage src={project.creatorAvatar || "/placeholder.svg"} alt={project.creatorName} />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {getCreatorInitials(project.creatorName)}
              </AvatarFallback>
            </Avatar>
            <Link
              href={`/profile/${project.creatorId}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              by {project.creatorName}
            </Link>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs hover:bg-primary/10 transition-colors duration-200"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors duration-200">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200">
              <Heart className="w-4 h-4" />
              <span>{project.followerCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
