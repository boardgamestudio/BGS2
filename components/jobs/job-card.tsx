"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Clock, DollarSign, Users, ExternalLink, Gamepad2 } from "lucide-react"
import Link from "next/link"
import type { Job } from "@/types/job"
import {
  getJobTypeDisplayName,
  getJobCategoryDisplayName,
  getJobTypeVariant,
  getDaysUntilExpiry,
  isJobExpired,
} from "@/lib/job-utils"
import { useState, useEffect } from "react"

interface JobCardProps {
  job: Job
  showPoster?: boolean
}

export function JobCard({ job, showPoster = true }: JobCardProps) {
  const daysLeft = getDaysUntilExpiry(job.expiresAt)
  const expired = isJobExpired(job.expiresAt)

  const [projectExists, setProjectExists] = useState<boolean | null>(null)

  useEffect(() => {
    if (job.associatedProjectId) {
      try {
        const savedProjects = localStorage.getItem("bgs_projects")
        if (savedProjects) {
          const projects = JSON.parse(savedProjects)
          const exists = projects.some((p: any) => p.id === job.associatedProjectId)
          setProjectExists(exists)
        } else {
          setProjectExists(false)
        }
      } catch (error) {
        console.error("Error checking project existence:", error)
        setProjectExists(false)
      }
    }
  }, [job.associatedProjectId])

  const getCompanyInitials = (company: string) => {
    return company
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatSalary = (min: number, max: number, currency: string) => {
    if (min === 0 && max === 0) return "Salary not specified"
    if (min === max) return `${currency} ${min.toLocaleString()}`
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case "entry":
        return "Entry Level"
      case "mid":
        return "Mid Level"
      case "senior":
        return "Senior Level"
      case "lead":
        return "Lead/Principal"
      default:
        return level
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "art":
        return "Art & Illustration"
      case "design":
        return "Game Design"
      case "development":
        return "Development"
      case "writing":
        return "Writing"
      case "marketing":
        return "Marketing"
      case "production":
        return "Production"
      default:
        return category
    }
  }

  return (
    <Card
      className={`group hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${expired ? "opacity-60" : ""}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            <Avatar className="w-12 h-12 flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
              <AvatarImage src={job.companyLogo || "/placeholder.svg"} alt={job.company} />
              <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold">
                {getCompanyInitials(job.company)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200 truncate">
                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
              </CardTitle>
              <CardDescription className="font-medium">{job.company}</CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={getJobTypeVariant(job.type)} className="shadow-sm">
                  {getJobTypeDisplayName(job.type)}
                </Badge>
                <Badge variant="outline" className="hover:bg-primary/10 transition-colors duration-200">
                  {getJobCategoryDisplayName(job.category)}
                </Badge>
                <Badge variant="outline" className="hover:bg-primary/10 transition-colors duration-200">
                  {getExperienceLabel(job.experienceLevel)}
                </Badge>
              </div>
            </div>
          </div>
          {expired && (
            <div className="flex items-center text-destructive">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">Expired</span>
            </div>
          )}
        </div>

        {job.associatedProjectId && job.associatedProjectTitle && projectExists && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-muted/50 rounded-lg">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Related to project:
              <Link
                href={`/projects/${job.associatedProjectId}`}
                className="text-primary hover:underline ml-1 font-medium"
              >
                {job.associatedProjectTitle}
              </Link>
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>

        {/* Skills */}
        {job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 4).map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs hover:bg-primary/10 transition-colors duration-200"
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors duration-200">
                +{job.skills.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Job Details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{job.isRemote ? "Remote" : job.location}</span>
            </div>
            {job.salaryRange && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium">
                  {formatSalary(job.salaryRange.min, job.salaryRange.max, job.salaryRange.currency)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span className="font-medium">{job.applicationCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span
                className={`font-medium ${daysLeft <= 3 && daysLeft > 0 ? "text-orange-500" : daysLeft <= 0 ? "text-destructive" : ""}`}
              >
                {daysLeft > 0 ? `${daysLeft}d left` : "Expired"}
              </span>
            </div>
          </div>
        </div>

        {showPoster && (
          <div className="flex items-center justify-between pt-2 border-t">
            <Avatar className="w-6 h-6">
              <AvatarImage src="/placeholder.svg?height=24&width=24" alt={job.posterName} />
              <AvatarFallback className="text-xs">
                {job.posterName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link
              href={`/profile/${job.posterId}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Posted by {job.posterName}
            </Link>
          </div>
        )}

        {job.associatedProjectId && job.associatedProjectTitle && projectExists && (
          <div className="flex items-center gap-2 mt-4 p-3 bg-muted/50 rounded-lg">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Related to project:
              <Link
                href={`/projects/${job.associatedProjectId}`}
                className="text-primary hover:underline ml-1 font-medium"
              >
                {job.associatedProjectTitle}
              </Link>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{job.applicationCount} applicants</span>
          </div>
          <Button size="sm" className="flex items-center gap-2">
            Apply Now
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
