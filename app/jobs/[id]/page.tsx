"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Share2,
  Bookmark,
  AlertTriangle,
  Mail,
  ExternalLink,
  Building,
  Gamepad2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Job } from "@/types/job"
import {
  getJobTypeDisplayName,
  getJobCategoryDisplayName,
  getExperienceLevelDisplayName,
  getJobTypeVariant,
  getDaysUntilExpiry,
  isJobExpired,
} from "@/lib/job-utils"

interface JobPageProps {
  params: {
    id: string
  }
}

export default function JobPage({ params }: JobPageProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [projectExists, setProjectExists] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadJob = () => {
      const savedJobs = localStorage.getItem("bgs_jobs")
      if (savedJobs) {
        try {
          const parsedJobs: Job[] = JSON.parse(savedJobs)
          const foundJob = parsedJobs.find((j) => j.id === params.id)
          if (foundJob) {
            setJob(foundJob)

            if (foundJob.associatedProjectId) {
              const savedProjects = localStorage.getItem("bgs_projects")
              if (savedProjects) {
                const projects = JSON.parse(savedProjects)
                const exists = projects.some((p: any) => p.id === foundJob.associatedProjectId)
                setProjectExists(exists)
              } else {
                setProjectExists(false)
              }
            }
          } else {
            console.log("[v0] Job not found with ID:", params.id)
          }
        } catch (error) {
          console.error("[v0] Error parsing jobs from localStorage:", error)
        }
      }
      setLoading(false)
    }

    loadJob()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">BGS</span>
                </div>
                <h1 className="text-xl font-bold font-space-grotesk">Board Game Studio</h1>
              </div>
              <Link href="/jobs">
                <Button variant="outline">Back to Jobs</Button>
              </Link>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link href="/jobs">
            <Button>Browse All Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  const daysLeft = getDaysUntilExpiry(job.expiresAt)
  const expired = isJobExpired(job.expiresAt)

  const getCompanyInitials = (company: string) => {
    return company
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BGS</span>
              </div>
              <h1 className="text-xl font-bold font-space-grotesk">Board Game Studio</h1>
            </div>
            <Link href="/jobs">
              <Button variant="outline">Back to Jobs</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={job.companyLogo || "/placeholder.svg"} alt={job.company} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-lg">
                      {getCompanyInitials(job.company)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h1 className="text-2xl font-bold font-space-grotesk mb-1">{job.title}</h1>
                        <p className="text-lg text-muted-foreground mb-3">{job.company}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getJobTypeVariant(job.type)}>{getJobTypeDisplayName(job.type)}</Badge>
                          <Badge variant="outline">{getJobCategoryDisplayName(job.category)}</Badge>
                          <Badge variant="outline">{getExperienceLevelDisplayName(job.experienceLevel)}</Badge>
                        </div>
                      </div>
                      {expired && (
                        <div className="flex items-center text-destructive">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          <span className="font-medium">Expired</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{job.isRemote ? "Remote" : job.location}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      <span>
                        {job.salaryRange.currency}
                        {job.salaryRange.min.toLocaleString()}-{job.salaryRange.max.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{job.applicationCount} applicants</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{daysLeft > 0 ? `${daysLeft} days left` : "Expired"}</span>
                  </div>
                </div>

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
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap">{job.description}</div>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-space-grotesk">Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {job.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Apply for this Job</CardTitle>
                {!expired && (
                  <CardDescription>
                    This position expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {expired ? (
                  <div className="text-center py-4">
                    <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-destructive font-medium">This job posting has expired</p>
                  </div>
                ) : (
                  <>
                    <Button className="w-full" size="lg">
                      {job.applyMethod?.type === "email" ? (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Apply via Email
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Apply on Company Site
                        </>
                      )}
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Job Type</span>
                    <Badge variant={getJobTypeVariant(job.type)}>{getJobTypeDisplayName(job.type)}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span>{getJobCategoryDisplayName(job.category)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span>{getExperienceLevelDisplayName(job.experienceLevel)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>{job.isRemote ? "Remote" : job.location}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Salary</span>
                      <span>
                        {job.salaryRange.currency}
                        {job.salaryRange.min.toLocaleString()}-{job.salaryRange.max.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Posted</span>
                    <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expires</span>
                    <span>{new Date(job.expiresAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Applications</span>
                    <span>{job.applicationCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">About {job.company}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={job.companyLogo || "/placeholder.svg"} alt={job.company} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {getCompanyInitials(job.company)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{job.company}</h4>
                    <p className="text-sm text-muted-foreground">Game Development Studio</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {job.company} is focused on creating engaging board game experiences that bring players together.
                </p>
                <Button variant="outline" className="w-full bg-transparent">
                  <Building className="w-4 h-4 mr-2" />
                  View Company Profile
                </Button>
              </CardContent>
            </Card>

            {/* Posted By */}
            <Card>
              <CardHeader>
                <CardTitle className="font-space-grotesk">Posted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={job.posterName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {job.posterName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/profile/${job.posterId}`}
                      className="font-semibold hover:text-primary transition-colors"
                    >
                      {job.posterName}
                    </Link>
                    <p className="text-sm text-muted-foreground">@{job.posterUsername || job.posterId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
