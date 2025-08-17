import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Globe, Users, Calendar } from "lucide-react"
import type { User } from "@/types/user"
import { getRoleDisplayName, getRoleBadgeVariant } from "@/lib/user-capabilities"

interface ProfileCardProps {
  user: User
  isOwnProfile?: boolean
  projectCount?: number
}

export function ProfileCard({ user, isOwnProfile = false, projectCount = 0 }: ProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="w-full">
      <CardHeader className="text-center pb-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold font-space-grotesk">{user.name}</h2>
              <Badge variant={getRoleBadgeVariant(user.role)}>{getRoleDisplayName(user.role)}</Badge>
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.bio && (
          <div>
            <p className="text-sm leading-relaxed">{user.bio}</p>
          </div>
        )}

        <div className="space-y-2">
          {user.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              {user.location}
            </div>
          )}
          {user.website && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Globe className="w-4 h-4 mr-2" />
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {user.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            {projectCount} {projectCount === 1 ? "project" : "projects"}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Joined {user.createdAt.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </div>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isOwnProfile && (
          <div className="pt-4 border-t">
            <Button className="w-full bg-transparent" variant="outline">
              Edit Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
