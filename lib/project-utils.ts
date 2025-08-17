import type { ProjectStage } from "@/types/project"

export function getStageDisplayName(stage: ProjectStage): string {
  switch (stage) {
    case "concept":
      return "Concept"
    case "development":
      return "Development"
    case "playtesting":
      return "Playtesting"
    case "production":
      return "Production"
    case "published":
      return "Published"
    case "cancelled":
      return "Cancelled"
  }
}

export function getStageColor(stage: ProjectStage): string {
  switch (stage) {
    case "concept":
      return "bg-chart-5 text-white"
    case "development":
      return "bg-primary text-primary-foreground"
    case "playtesting":
      return "bg-secondary text-secondary-foreground"
    case "production":
      return "bg-accent text-accent-foreground"
    case "published":
      return "bg-chart-2 text-white"
    case "cancelled":
      return "bg-muted text-muted-foreground"
  }
}

export function getStageVariant(stage: ProjectStage): "default" | "secondary" | "outline" | "destructive" {
  switch (stage) {
    case "concept":
      return "outline"
    case "development":
      return "default"
    case "playtesting":
      return "secondary"
    case "production":
      return "secondary"
    case "published":
      return "default"
    case "cancelled":
      return "destructive"
  }
}

export const commonTags = [
  "Strategy",
  "Card Game",
  "Board Game",
  "Dice Game",
  "Party Game",
  "Cooperative",
  "Competitive",
  "Family Game",
  "Abstract",
  "Thematic",
  "Worker Placement",
  "Deck Building",
  "Area Control",
  "Engine Building",
  "Roll & Write",
  "Social Deduction",
  "Puzzle",
  "Educational",
  "Print & Play",
  "Digital",
]
