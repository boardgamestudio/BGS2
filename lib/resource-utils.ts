import type { Resource, ResourceCategory, ResourceType } from "@/types/resource"

export const resourceCategories: { value: ResourceCategory; label: string; description: string }[] = [
  { value: "software", label: "Software & Tools", description: "Design software, project management tools" },
  { value: "manufacturing", label: "Manufacturing", description: "Game piece manufacturers, card printers" },
  { value: "artwork", label: "Artwork & Design", description: "Illustrators, graphic designers, artists" },
  { value: "marketing", label: "Marketing & PR", description: "Marketing agencies, PR services, reviewers" },
  { value: "legal", label: "Legal Services", description: "IP lawyers, contract services, licensing" },
  { value: "education", label: "Education", description: "Courses, workshops, tutorials" },
  { value: "components", label: "Components", description: "Dice, tokens, boards, boxes suppliers" },
  { value: "printing", label: "Printing", description: "Rulebook printing, box printing services" },
  { value: "distribution", label: "Distribution", description: "Publishers, distributors, fulfillment" },
  { value: "other", label: "Other", description: "Miscellaneous resources and services" },
]

export const resourceTypes: { value: ResourceType; label: string }[] = [
  { value: "tool", label: "Tool" },
  { value: "service", label: "Service" },
  { value: "supplier", label: "Supplier" },
  { value: "course", label: "Course" },
  { value: "template", label: "Template" },
  { value: "guide", label: "Guide" },
]

export function getCategoryInfo(category: ResourceCategory) {
  return resourceCategories.find((cat) => cat.value === category)
}

export function getTypeInfo(type: ResourceType) {
  return resourceTypes.find((t) => t.value === type)
}

export function formatPrice(price?: Resource["price"]) {
  if (!price) return "Contact for pricing"

  if (price.type === "free") return "Free"
  if (price.type === "freemium") return "Freemium"
  if (price.amount && price.currency) {
    return `${price.currency}${price.amount}`
  }
  return "Paid"
}

export function generateResourceSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export const mockResources: any[] = []
