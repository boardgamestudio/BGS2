export type JobType = "full-time" | "part-time" | "contract" | "freelance" | "internship"
export type JobCategory = "art" | "design" | "development" | "writing" | "marketing" | "production" | "other"
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead"

export interface Job {
  id: string
  title: string
  company: string
  companyLogo?: string
  description: string
  requirements: string[]
  responsibilities: string[]
  type: JobType
  category: JobCategory
  experienceLevel: ExperienceLevel
  location: string
  isRemote: boolean
  salaryRange?: {
    min: number
    max: number
    currency: string
  }
  skills: string[]
  applyMethod: {
    type: "email" | "url"
    value: string
  }
  relatedProjectId?: string
  relatedCompanyId?: string
  associatedProjectId?: string
  associatedProjectTitle?: string
  posterId: string
  posterName: string
  posterUsername: string
  isActive: boolean
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
  applicationCount: number
}

export interface JobFilters {
  type?: JobType[]
  category?: JobCategory[]
  location?: string
  isRemote?: boolean
  experienceLevel?: ExperienceLevel[]
  skills?: string[]
  search?: string
}

export interface JobApplication {
  id: string
  jobId: string
  applicantId: string
  applicantName: string
  applicantEmail: string
  coverLetter?: string
  portfolioUrl?: string
  resumeUrl?: string
  appliedAt: Date
  status: "pending" | "reviewed" | "accepted" | "rejected"
}
