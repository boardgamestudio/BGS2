export type ProjectStage = "concept" | "development" | "playtesting" | "production" | "published" | "cancelled"
export type ProjectVisibility = "public" | "private" | "members-only"
export type MembershipType = "learner" | "freelancer" | "designer" | "service"

export interface Project {
  id: string
  title: string
  summary: string
  description?: string
  stage: ProjectStage
  tags: string[]
  creatorId: string
  creatorName: string
  creatorUsername: string
  creatorAvatar?: string
  creatorMembershipTypes: MembershipType[]
  visibility: ProjectVisibility
  coverImage?: string
  gallery: ProjectImage[]
  devJournal: DevJournalEntry[]
  followers: string[]
  followerCount: number

  gameType?: string[]
  playerCount?: {
    min: number
    max: number
  }
  playTime?: {
    min: number
    max: number
  }
  targetAge?: {
    min: number
    max?: number
  }
  complexity?: number // 1-5 scale

  // Project status flags
  lookingForPublisher?: boolean
  lookingForManufacturer?: boolean
  lookingForPlaytesters?: boolean
  lookingForArtist?: boolean
  lookingForDeveloper?: boolean

  // Publishing info
  publisherName?: string
  manufacturerName?: string
  releaseDate?: Date
  msrp?: number

  // Social metrics
  viewCount: number
  likeCount: number
  commentCount: number

  createdAt: Date
  updatedAt: Date
}

export interface ProjectImage {
  id: string
  url: string
  caption?: string
  uploadedAt: Date
}

export interface DevJournalEntry {
  id: string
  title: string
  content: string
  publishedAt: Date
  isPublic: boolean
}

export interface ProjectFilters {
  stage?: ProjectStage[]
  tags?: string[]
  search?: string
  creator?: string
}
