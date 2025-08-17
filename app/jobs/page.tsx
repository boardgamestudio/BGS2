"use client"

import { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { JobCard } from "@/components/jobs/job-card"
import { Search, Filter, Plus, Briefcase } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"
import type { Job } from "@/types/job"

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState<string[]>([])
  const [isRemoteOnly, setIsRemoteOnly] = useState(false)
  const [locationFilter, setLocationFilter] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    const loadJobs = () => {
      const savedJobs = localStorage.getItem("bgs_jobs")
      if (savedJobs) {
        try {
          const parsedJobs = JSON.parse(savedJobs)
          setJobs(parsedJobs)
          console.log("[v0] Loaded jobs from localStorage:", parsedJobs.length)
        } catch (error) {
          console.error("[v0] Error parsing jobs from localStorage:", error)
          setJobs([])
        }
      } else {
        setJobs([])
      }
    }

    loadJobs()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bgs_jobs") {
        loadJobs()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const myJobs = jobs.filter((job) => user && job.posterId === user.id)
  const allJobs = jobs

  const filteredAndSortedJobs = useMemo(() => {
    const filtered = allJobs.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesJobType = selectedJobTypes.length === 0 || selectedJobTypes.includes(job.type)

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(job.category)

      const matchesExperience =
        selectedExperienceLevels.length === 0 || selectedExperienceLevels.includes(job.experienceLevel)

      const matchesRemote = !isRemoteOnly || job.isRemote

      const matchesLocation = locationFilter === "" || job.location.toLowerCase().includes(locationFilter.toLowerCase())

      return matchesSearch && matchesJobType && matchesCategory && matchesExperience && matchesRemote && matchesLocation
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "expiring":
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
        case "salary-high":
          return (b.salaryRange?.max || 0) - (a.salaryRange?.max || 0)
        case "salary-low":
          return (a.salaryRange?.min || 0) - (b.salaryRange?.min || 0)
        case "applications":
          return (b.applicationCount || 0) - (a.applicationCount || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedJobTypes, selectedCategories, selectedExperienceLevels, isRemoteOnly, locationFilter, sortBy])

  const handleJobTypeChange = (jobType: string, checked: boolean) => {
    setSelectedJobTypes((prev) => (checked ? [...prev, jobType] : prev.filter((type) => type !== jobType)))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories((prev) => (checked ? [...prev, category] : prev.filter((cat) => cat !== category)))
  }

  const handleExperienceChange = (level: string, checked: boolean) => {
    setSelectedExperienceLevels((prev) => (checked ? [...prev, level] : prev.filter((exp) => exp !== level)))
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedJobTypes([])
    setSelectedCategories([])
    setSelectedExperienceLevels([])
    setIsRemoteOnly(false)
    setLocationFilter("")
  }

  const activeFilters = [
    ...selectedJobTypes.map((type) => ({ type: "jobType", value: type, label: type })),
    ...selectedCategories.map((cat) => ({ type: "category", value: cat, label: cat })),
    ...selectedExperienceLevels.map((exp) => ({ type: "experience", value: exp, label: exp })),
    ...(isRemoteOnly ? [{ type: "remote", value: "remote", label: "Remote" }] : []),
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Job Board" subtitle="Find your next opportunity in the board game industry" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-muted-foreground">
              Connect with talented creators or post a job to find the perfect person for your project
            </p>
          </div>
          <Link href="/jobs/post">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Post a Job
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="all">Browse All ({filteredAndSortedJobs.length})</TabsTrigger>
            <TabsTrigger value="my-jobs" disabled={!user}>
              <Briefcase className="w-4 h-4 mr-2" />
              My Jobs ({user ? myJobs.length : 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Filter className="w-4 h-4 mr-2" />
                          Filters
                        </h3>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            placeholder="Search jobs..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Job Type</h4>
                        <div className="space-y-2">
                          {["full-time", "part-time", "contract", "freelance", "internship"].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={selectedJobTypes.includes(type)}
                                onCheckedChange={(checked) => handleJobTypeChange(type, checked as boolean)}
                              />
                              <Label htmlFor={type} className="text-sm capitalize">
                                {type.replace("-", " ")}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Category</h4>
                        <div className="space-y-2">
                          {["art", "design", "writing", "marketing", "production"].map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                              />
                              <Label htmlFor={category} className="text-sm capitalize">
                                {category === "art" ? "Art & Illustration" : category}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Experience Level</h4>
                        <div className="space-y-2">
                          {["entry", "mid", "senior", "lead"].map((level) => (
                            <div key={level} className="flex items-center space-x-2">
                              <Checkbox
                                id={level}
                                checked={selectedExperienceLevels.includes(level)}
                                onCheckedChange={(checked) => handleExperienceChange(level, checked as boolean)}
                              />
                              <Label htmlFor={level} className="text-sm capitalize">
                                {level === "entry"
                                  ? "Entry Level"
                                  : level === "mid"
                                    ? "Mid Level"
                                    : level === "senior"
                                      ? "Senior Level"
                                      : "Lead/Principal"}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Location</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remote"
                              checked={isRemoteOnly}
                              onCheckedChange={(checked) => setIsRemoteOnly(checked as boolean)}
                            />
                            <Label htmlFor="remote" className="text-sm">
                              Remote Only
                            </Label>
                          </div>
                          <Input
                            placeholder="Enter location..."
                            className="text-sm"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                          />
                        </div>
                      </div>

                      <Button variant="outline" className="w-full bg-transparent" onClick={clearAllFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <p className="text-muted-foreground">{filteredAndSortedJobs.length} jobs found</p>
                    {activeFilters.length > 0 && (
                      <div className="flex items-center space-x-2">
                        {activeFilters.map((filter, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                            <span className="capitalize">{filter.label}</span>
                            <button
                              className="ml-1 hover:text-destructive"
                              onClick={() => {
                                if (filter.type === "jobType") {
                                  handleJobTypeChange(filter.value, false)
                                } else if (filter.type === "category") {
                                  handleCategoryChange(filter.value, false)
                                } else if (filter.type === "experience") {
                                  handleExperienceChange(filter.value, false)
                                } else if (filter.type === "remote") {
                                  setIsRemoteOnly(false)
                                }
                              }}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="expiring">Expiring Soon</SelectItem>
                      <SelectItem value="salary-high">Highest Salary</SelectItem>
                      <SelectItem value="salary-low">Lowest Salary</SelectItem>
                      <SelectItem value="applications">Most Applications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-6">
                  {filteredAndSortedJobs.length > 0 ? (
                    filteredAndSortedJobs.map((job) => <JobCard key={job.id} job={job} />)
                  ) : (
                    <Card className="p-8 text-center">
                      <CardContent>
                        <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Be the first to post a job opportunity for the board game community.
                        </p>
                        <Link href="/jobs/post">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Post the First Job
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {filteredAndSortedJobs.length > 0 && (
                  <div className="text-center mt-12">
                    <Button variant="outline" size="lg">
                      Load More Jobs
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">{myJobs.length} jobs you've posted</p>
              <Link href="/jobs/post">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Another Job
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              {myJobs.length > 0 ? (
                myJobs.map((job) => <JobCard key={job.id} job={job} showPoster={false} />)
              ) : (
                <Card className="p-8 text-center">
                  <CardContent>
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start connecting with talented board game creators by posting your first job.
                    </p>
                    <Link href="/jobs/post">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Post Your First Job
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
