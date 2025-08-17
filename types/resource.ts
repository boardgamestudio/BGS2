export interface Resource {
  id: string
  title: string
  description: string
  category: ResourceCategory
  type: ResourceType
  url?: string
  imageUrl?: string
  submittedBy: string
  submittedByName: string
  submittedByAvatar?: string
  submittedAt: Date
  status: ResourceStatus
  rating: number
  reviewCount: number
  tags: string[]
  associatedProjectId?: string
  associatedProjectTitle?: string
  price?: {
    type: "free" | "paid" | "freemium"
    amount?: number
    currency?: string
  }
  contact?: {
    email?: string
    website?: string
    phone?: string
  }
}

export type ResourceCategory =
  | "software"
  | "manufacturing"
  | "artwork"
  | "marketing"
  | "legal"
  | "education"
  | "components"
  | "printing"
  | "distribution"
  | "other"

export type ResourceType = "tool" | "service" | "supplier" | "course" | "template" | "guide"

export type ResourceStatus = "pending" | "approved" | "rejected"

export interface ResourceReview {
  id: string
  resourceId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  createdAt: Date
  helpful: number
}
