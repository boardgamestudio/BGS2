import type { Group, GroupCategory, GroupRole } from "@/types/group"

export function getGroupCategoryColor(category: GroupCategory): string {
  const colors = {
    design: "bg-blue-500",
    playtesting: "bg-green-500",
    publishing: "bg-purple-500",
    art: "bg-pink-500",
    writing: "bg-orange-500",
    marketing: "bg-teal-500",
    local: "bg-indigo-500",
    genre: "bg-red-500",
    general: "bg-gray-500",
  }
  return colors[category] || colors.general
}

export function getGroupTypeLabel(type: Group["type"]): string {
  const labels = {
    public: "Public",
    private: "Private",
    "invite-only": "Invite Only",
  }
  return labels[type]
}

export function canUserJoinGroup(group: Group, userId?: string): boolean {
  if (!userId) return false

  // Check if user is already a member
  const isMember = group.members.some((member) => member.userId === userId)
  if (isMember) return false

  // Check if user has pending request
  const hasPendingRequest = group.pendingRequests.some((request) => request.userId === userId)
  if (hasPendingRequest) return false

  // Check group capacity
  if (group.maxMembers && group.memberCount >= group.maxMembers) return false

  // Public groups can be joined directly (unless requires approval)
  if (group.type === "public") return true

  // Private and invite-only groups require invitation
  return false
}

export function getUserGroupRole(group: Group, userId?: string): GroupRole | null {
  if (!userId) return null

  if (group.admins.some((admin) => admin.userId === userId)) return "admin"
  if (group.moderators.some((mod) => mod.userId === userId)) return "moderator"
  if (group.members.some((member) => member.userId === userId)) return "member"

  return null
}

export function canUserModerateGroup(group: Group, userId?: string): boolean {
  const role = getUserGroupRole(group, userId)
  return role === "admin" || role === "moderator"
}

export function canUserManageGroup(group: Group, userId?: string): boolean {
  return getUserGroupRole(group, userId) === "admin" || group.creatorId === userId
}

export function formatMemberCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

export function getActivityStatus(lastActivity: Date): string {
  const now = new Date()
  const diffInHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) return "Active now"
  if (diffInHours < 24) return `Active ${Math.floor(diffInHours)}h ago`
  if (diffInHours < 168) return `Active ${Math.floor(diffInHours / 24)}d ago`
  return `Active ${Math.floor(diffInHours / 168)}w ago`
}
