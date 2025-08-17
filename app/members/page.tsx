"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Briefcase, Calendar, Users } from "lucide-react"
import Link from "next/link"
import type { User } from "@/types/user"
import { AppHeader } from "@/components/layout/app-header"

export default function MembersPage() {
  const [members, setMembers] = useState<User[]>([])
  const [filteredMembers, setFilteredMembers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [memberTypeFilter, setMemberTypeFilter] = useState("all")
  const [skillFilter, setSkillFilter] = useState("all")

  useEffect(() => {
    // Load members from localStorage
    const users = JSON.parse(localStorage.getItem("bgs_users") || "[]")
    setMembers(users)
    setFilteredMembers(users)
  }, [])

  useEffect(() => {
    let filtered = members

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (member) =>
          member.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by member type
    if (memberTypeFilter !== "all") {
      filtered = filtered.filter((member) => member.membershipTypes.includes(memberTypeFilter as any))
    }

    // Filter by skill
    if (skillFilter !== "all") {
      filtered = filtered.filter((member) => member.skills?.includes(skillFilter))
    }

    setFilteredMembers(filtered)
  }, [members, searchTerm, memberTypeFilter, skillFilter])

  const allSkills = Array.from(new Set(members.flatMap((m) => m.skills || [])))

  const getMemberTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "service":
        return "default" // Orange
      case "designer":
        return "secondary" // Teal
      case "freelancer":
        return "outline" // Purple
      default:
        return "outline"
    }
  }

  const getMemberStats = (member: User) => {
    const projectCount = member.projects?.length || 1 // Default to 1 for demo
    const portfolioCount = member.portfolioImages?.length || 5 // Default to 5 for demo
    const eventCount = Math.floor(Math.random() * 5) + 1 // Random for demo

    return { projectCount, portfolioCount, eventCount }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Community Members"
        subtitle="Connect with board game designers, creators, and service providers"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Member Type</label>
                  <Select value={memberTypeFilter} onValueChange={setMemberTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="learner">Learner</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="service">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill</label>
                  <Select value={skillFilter} onValueChange={setSkillFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      {allSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setMemberTypeFilter("all")
                      setSkillFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const stats = getMemberStats(member)
              return (
                <Card
                  key={member.id}
                  className="hover:shadow-lg transition-shadow bg-card/80 backdrop-blur border-border/50"
                >
                  <CardContent className="p-6">
                    {/* Profile Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <img
                          src={member.profilePicture || "/placeholder.svg"}
                          alt={member.displayName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-border"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate text-foreground">{member.displayName}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.jobTitle || "Board Game Designer"}
                        </p>
                        {member.city && member.country && (
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">
                              {member.city}, {member.country}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Member Type Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.membershipTypes.map((type) => (
                        <Badge
                          key={type}
                          variant={getMemberTypeBadgeVariant(type)}
                          className="text-xs capitalize font-medium"
                        >
                          {type === "service"
                            ? "Service Provider"
                            : type === "designer"
                              ? "Game Designer"
                              : type === "freelancer"
                                ? "Freelancer"
                                : "Learner"}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats Icons */}
                    <div className="flex justify-center space-x-6 mb-4">
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-muted-foreground" />
                          </div>
                          {stats.projectCount > 0 && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-primary-foreground">{stats.projectCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-muted-foreground" />
                          </div>
                          {stats.portfolioCount > 0 && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-secondary-foreground">
                                {stats.portfolioCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                          </div>
                          {stats.eventCount > 0 && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-accent-foreground">{stats.eventCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                      <Link href={`/profile/${member.id}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No members found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
