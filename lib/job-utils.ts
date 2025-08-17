import type { JobType, JobCategory, ExperienceLevel } from "@/types/job"

export function getJobTypeDisplayName(type: JobType): string {
  switch (type) {
    case "full-time":
      return "Full-time"
    case "part-time":
      return "Part-time"
    case "contract":
      return "Contract"
    case "freelance":
      return "Freelance"
    case "internship":
      return "Internship"
  }
}

export function getJobCategoryDisplayName(category: JobCategory): string {
  switch (category) {
    case "art":
      return "Art & Illustration"
    case "design":
      return "Game Design"
    case "development":
      return "Development"
    case "writing":
      return "Writing & Content"
    case "marketing":
      return "Marketing & PR"
    case "production":
      return "Production"
    case "other":
      return "Other"
  }
}

export function getExperienceLevelDisplayName(level: ExperienceLevel): string {
  switch (level) {
    case "entry":
      return "Entry Level"
    case "mid":
      return "Mid Level"
    case "senior":
      return "Senior Level"
    case "lead":
      return "Lead/Principal"
  }
}

export function getJobTypeVariant(type: JobType): "default" | "secondary" | "outline" {
  switch (type) {
    case "full-time":
      return "default"
    case "part-time":
      return "secondary"
    case "contract":
      return "outline"
    case "freelance":
      return "outline"
    case "internship":
      return "secondary"
  }
}

function ensureDate(date: Date | string): Date {
  return typeof date === "string" ? new Date(date) : date
}

export function getDaysUntilExpiry(expiresAt: Date | string): number {
  const expiryDate = ensureDate(expiresAt)
  const now = new Date()
  const diffTime = expiryDate.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function isJobExpired(expiresAt: Date | string): boolean {
  const expiryDate = ensureDate(expiresAt)
  return new Date() > expiryDate
}

export const commonSkills = [
  "Game Design",
  "Illustration",
  "Graphic Design",
  "3D Modeling",
  "Animation",
  "UI/UX Design",
  "Concept Art",
  "Character Design",
  "Environment Art",
  "Technical Writing",
  "Copywriting",
  "Playtesting",
  "Project Management",
  "Marketing",
  "Social Media",
  "Community Management",
  "Unity",
  "Unreal Engine",
  "Photoshop",
  "Illustrator",
  "Blender",
  "Maya",
  "InDesign",
]
