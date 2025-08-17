import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Lock, Eye, UserPlus } from "lucide-react"
import Link from "next/link"
import type { Group } from "@/types/group"
import { getGroupCategoryColor, getGroupTypeLabel, formatMemberCount, getActivityStatus } from "@/lib/group-utils"

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  const typeIcon = {
    public: <Eye className="w-3 h-3" />,
    private: <Lock className="w-3 h-3" />,
    "invite-only": <UserPlus className="w-3 h-3" />,
  }

  return (
    <Card className="hover:border-primary/50 transition-colors">
      {group.coverImage && (
        <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
          <img src={group.coverImage || "/placeholder.svg"} alt={group.name} className="w-full h-full object-cover" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={group.avatar || "/placeholder.svg"} />
            <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={`${getGroupCategoryColor(group.category)} text-white border-0`}>
                {group.category}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-xs">
                {typeIcon[group.type]}
                {getGroupTypeLabel(group.type)}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-tight">
              <Link href={`/groups/${group.id}`} className="hover:text-primary transition-colors">
                {group.name}
              </Link>
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{group.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>
              {formatMemberCount(group.memberCount)} members
              {group.maxMembers && ` (${group.maxMembers} max)`}
            </span>
          </div>

          <div className="text-sm text-muted-foreground">{getActivityStatus(group.lastActivity)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {group.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {group.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{group.tags.length - 2}
              </Badge>
            )}
          </div>

          <Button size="sm" variant="outline">
            {group.type === "public" ? "Join" : "Request"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
