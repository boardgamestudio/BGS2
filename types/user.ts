export type UserRole = "learner" | "freelancer" | "designer" | "service"

export interface User {
  id: string
  name: string
  username: string
  email: string
  role: UserRole
  memberTypes: MemberType[] // Users can have multiple member types
  location: string
  mobile?: string
  bio?: string
  skills?: string[]
  bggUsername?: string
  website?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    linkedin?: string
    discord?: string
    facebook?: string
    youtube?: string
  }
  avatar?: string
  banner?: string
  isPublic: boolean
  showInMarketplace?: boolean
  createdAt: Date
  lastLoginAt?: Date
  profileCompleteness: number
  // Professional fields
  jobTitle?: string
  companyStudio?: string
  professionalTagline?: string
  gameDesignFocus?: string[]
  languages?: string[]
  workExperience?: WorkExperience[]
  education?: Education[]
  portfolioImages?: PortfolioImage[]
}

export type MemberType = "learner" | "freelancer" | "designer" | "service"

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate?: string
  description?: string
  current: boolean
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  graduationYear: string
}

export interface PortfolioImage {
  id: string
  url: string
  title?: string
  description?: string
  uploadedAt: Date
}

export interface CompanyProfile {
  id: string
  userId: string
  companyName: string
  companyLogo?: string
  companyDescription?: string
  servicesOffered?: string[]
  contactEmail?: string
  contactNumber?: string
  companyWebsite?: string
  companySocialLinks?: {
    twitter?: string
    facebook?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  }
  yearFounded?: string
  numberOfEmployees?: string
  gameTypeSpecialization?: string[]
  address: {
    city: string
    state?: string
    country: string
  }
  createdAt: Date
}

export interface UserCapabilities {
  maxProjects: number
  maxPortfolioImages: number
  canPostJobs: boolean
  canCreateEvents: boolean
  canCreateGroups: boolean
  canSubmitResources: boolean
  canCreateCompanyProfile: boolean
  hasPrivateProfile: boolean
  hasPersonalFields: boolean
  hasProfessionalFields: boolean
  hasServiceFields: boolean
  canCombineWith: MemberType[]
}
