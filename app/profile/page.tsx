"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { EditProfileForm } from "@/components/profile/edit-profile-form"
import { ProjectCard } from "@/components/projects/project-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Edit, Plus } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [userProjects, setUserProjects] = useState([])

  useEffect(() => {
    if (user) {
      const projects = JSON.parse(localStorage.getItem("bgs_projects") || "[]")
      const myProjects = projects.filter((project) => project.creatorId === user.id)
      console.log("[v0] Loading projects for user:", user.id, "Found:", myProjects)
      setUserProjects(myProjects)
    }
  }, [user])

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Please log in</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={user.displayName}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="text-2xl font-bold">{user.displayName}</h1>
                      <div className="flex space-x-1">
                        {user.membershipTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="capitalize">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {user.jobTitle && <p className="text-lg text-muted-foreground mb-2">{user.jobTitle}</p>}
                    {user.professionalTagline && (
                      <p className="text-muted-foreground mb-3">{user.professionalTagline}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {user.city}, {user.country}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                  className="flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
                </Button>
              </div>
              {user.bio && <p className="mt-4 text-muted-foreground">{user.bio}</p>}
            </CardContent>
          </Card>

          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <EditProfileForm user={user} onClose={() => setIsEditing(false)} />
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Skills & Languages */}
              {(user.skills?.length > 0 || user.languages?.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Languages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.skills?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {user.languages?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                          {user.languages.map((language) => (
                            <Badge key={language} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Work Experience */}
              {user.workExperience?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.workExperience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{exp.position}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                        {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {user.education?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">
                          {edu.fieldOfStudy} • {edu.graduationYear}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="portfolio">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Portfolio will be displayed here once implemented.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">My Projects ({userProjects.length})</h3>
                <Link href="/projects/create">
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </Link>
              </div>

              {userProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} showCreator={false} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start sharing your board game projects with the community.
                    </p>
                    <Link href="/projects/create">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
