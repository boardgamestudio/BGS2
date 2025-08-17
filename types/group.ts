export interface Group {
  id: string
  name: string
  description: string
  category: GroupCategory
  type: GroupType
  coverImage?: string
  avatar?: string
  memberCount: number
  maxMembers?: number
  isPublic: boolean
  requiresApproval: boolean
  tags: string[]
  creatorId: string
  creatorName: string
  creatorUsername: string
  admins: GroupMember[]
  moderators: GroupMember[]
  members: GroupMember[]
  pendingRequests: GroupMember[]
  rules?: string[]
  location?: string
  createdAt: Date
  updatedAt: Date
  lastActivity: Date
}

export interface GroupMember {
  userId: string
  username: string
  name: string
  avatar?: string
  role: GroupRole
  joinedAt: Date
  lastActive?: Date
}

export interface GroupPost {
  id: string
  groupId: string
  authorId: string
  authorName: string
  authorUsername: string
  authorAvatar?: string
  title?: string
  content: string
  type: PostType
  attachments?: string[]
  likes: string[]
  likeCount: number
  commentCount: number
  isPinned: boolean
  createdAt: Date
  updatedAt: Date
}

export interface GroupComment {
  id: string
  postId: string
  authorId: string
  authorName: string
  authorUsername: string
  authorAvatar?: string
  content: string
  likes: string[]
  likeCount: number
  createdAt: Date
  updatedAt: Date
}

export type GroupCategory =
  | "design"
  | "playtesting"
  | "publishing"
  | "art"
  | "writing"
  | "marketing"
  | "local"
  | "genre"
  | "general"

export type GroupType = "public" | "private" | "invite-only"

export type GroupRole = "admin" | "moderator" | "member"

export type PostType = "discussion" | "announcement" | "question" | "showcase"

export const GROUP_CATEGORIES = [
  { value: "design", label: "Game Design" },
  { value: "playtesting", label: "Playtesting" },
  { value: "publishing", label: "Publishing" },
  { value: "art", label: "Art & Illustration" },
  { value: "writing", label: "Writing & Rules" },
  { value: "marketing", label: "Marketing" },
  { value: "local", label: "Local Community" },
  { value: "genre", label: "Game Genre" },
  { value: "general", label: "General Discussion" },
] as const

export const POST_TYPES = [
  { value: "discussion", label: "Discussion", icon: "💬" },
  { value: "announcement", label: "Announcement", icon: "📢" },
  { value: "question", label: "Question", icon: "❓" },
  { value: "showcase", label: "Showcase", icon: "🎨" },
] as const
