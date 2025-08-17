import type { UserRole, UserCapabilities, MemberType } from "@/types/user"

export function getUserCapabilities(role: UserRole): UserCapabilities {
  switch (role) {
    case "learner":
      return {
        maxProjects: 1,
        maxPortfolioImages: 5,
        canPostJobs: false,
        canCreateEvents: false,
        canCreateGroups: false,
        canSubmitResources: false,
        canCreateCompanyProfile: false,
        hasPrivateProfile: false,
        hasPersonalFields: true,
        hasProfessionalFields: false,
        hasServiceFields: false,
        canCombineWith: [],
      }
    case "freelancer":
      return {
        maxProjects: 1,
        maxPortfolioImages: 20,
        canPostJobs: false,
        canCreateEvents: false,
        canCreateGroups: false,
        canSubmitResources: false,
        canCreateCompanyProfile: false,
        hasPrivateProfile: true,
        hasPersonalFields: true,
        hasProfessionalFields: true,
        hasServiceFields: false,
        canCombineWith: ["designer"],
      }
    case "designer":
      return {
        maxProjects: 10,
        maxPortfolioImages: 50,
        canPostJobs: true,
        canCreateEvents: true,
        canCreateGroups: true,
        canSubmitResources: true,
        canCreateCompanyProfile: false,
        hasPrivateProfile: true,
        hasPersonalFields: true,
        hasProfessionalFields: true,
        hasServiceFields: false,
        canCombineWith: ["freelancer", "service"],
      }
    case "service":
      return {
        maxProjects: 10,
        maxPortfolioImages: 50,
        canPostJobs: true,
        canCreateEvents: true,
        canCreateGroups: true,
        canSubmitResources: true,
        canCreateCompanyProfile: true,
        hasPrivateProfile: true,
        hasPersonalFields: true,
        hasProfessionalFields: true,
        hasServiceFields: true,
        canCombineWith: ["designer"],
      }
  }
}

export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case "learner":
      return "Learner"
    case "freelancer":
      return "Freelancer/Creative"
    case "designer":
      return "Game Designer"
    case "service":
      return "Service Provider"
  }
}

export function getMemberTypeDisplayName(memberType: MemberType): string {
  switch (memberType) {
    case "learner":
      return "Learner"
    case "freelancer":
      return "Freelancer/Creative"
    case "designer":
      return "Game Designer"
    case "service":
      return "Service Provider"
  }
}

export function getRoleBadgeVariant(role: UserRole): "default" | "secondary" | "outline" | "destructive" {
  switch (role) {
    case "learner":
      return "outline"
    case "freelancer":
      return "secondary"
    case "designer":
      return "default"
    case "service":
      return "destructive"
  }
}

export function isPaidTier(role: UserRole): boolean {
  return role === "designer" || role === "service"
}

export function canCombineMemberTypes(type1: MemberType, type2: MemberType): boolean {
  const capabilities1 = getUserCapabilities(type1)
  const capabilities2 = getUserCapabilities(type2)

  return capabilities1.canCombineWith.includes(type2) || capabilities2.canCombineWith.includes(type1)
}
