"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Calendar, Mail, Phone, Globe } from "lucide-react"
import { AppHeader } from "@/components/layout/app-header"
import { ProjectsTab } from "@/components/profile/projects-tab"
import type { User } from "@/types/user"

export default function PublicProfilePage() {
  const params = useParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("bgs_users") || "[]")
    const foundUser = users.find((u: User) => u.id === params.id)
    console.log("[v0] Profile page - Looking for user with ID:", params.id)
    console.log("[v0] Profile page - Found user:", foundUser)
    setUser(foundUser || null)
    setLoading(false)
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!user) {
    return <div className="min-h-screen bg-background flex items-center justify-center">User not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground mb-8">View member profile and portfolio</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-0">
              {/* Banner */}
              <div
                className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-lg"
                style={{
                  backgroundImage: user.profileBanner ? `url(${user.profileBanner})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              {/* Profile Info */}
              <div className="p-6 -mt-16 relative">
                <div className="flex items-start space-x-6">
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={user.displayName}
                    className="w-32 h-32 rounded-full object-cover border-4 border-background"
                  />
                  <div className="flex-1 mt-16">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h2 className="text-3xl font-bold">{user.displayName}</h2>
                          <div className="flex space-x-1">
                            {user.membershipTypes.map((type) => (
                              <Badge key={type} variant="secondary" className="capitalize">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {user.jobTitle && <p className="text-xl text-muted-foreground mb-2">{user.jobTitle}</p>}
                        {user.professionalTagline && (
                          <p className="text-muted-foreground mb-3">{user.professionalTagline}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {user.city && user.country && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {user.city}, {user.country}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Buttons */}
                      <div className="flex space-x-2">
                        {user.socialLinks?.website && (
                          <Button asChild variant="outline" size="sm">
                            <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-4 h-4 mr-2" />
                              Website
                            </a>
                          </Button>
                        )}
                        {user.contactEmail && (
                          <Button asChild variant="outline" size="sm">
                            <a href={`mailto:${user.contactEmail}`}>
                              <Mail className="w-4 h-4 mr-2" />
                              Contact
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    {user.bio && <p className="mt-4 text-muted-foreground">{user.bio}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Content */}
          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* About */}
                  {user.bio && (
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">About {user.displayName}</h2>
                        <p className="text-muted-foreground">{user.bio}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Skills & Languages */}
                  {(user.skills?.length || user.languages?.length) && (
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Skills & Languages</h2>
                        {user.skills?.length && (
                          <div className="mb-4">
                            <h3 className="font-medium mb-2">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                              {user.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {user.languages?.length && (
                          <div>
                            <h3 className="font-medium mb-2">Languages</h3>
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
                  {user.workExperience?.length && (
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
                        <div className="space-y-4">
                          {user.workExperience.map((exp, index) => (
                            <div key={index} className="border-l-2 border-primary/20 pl-4">
                              <h3 className="font-medium">{exp.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {exp.company} • {exp.period}
                              </p>
                              {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Service Provider Info */}
                  {user.membershipTypes.includes("service") && user.companyDescription && (
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          {user.companyLogo && (
                            <img
                              src={user.companyLogo || "/placeholder.svg"}
                              alt="Company Logo"
                              className="w-12 h-12 rounded"
                            />
                          )}
                          <h2 className="text-xl font-semibold">{user.companyStudio || "Company"}</h2>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">About Company</h3>
                            <p className="text-muted-foreground">{user.companyDescription}</p>
                          </div>

                          {user.servicesOffered?.length && (
                            <div>
                              <h3 className="font-medium mb-2">Services Offered</h3>
                              <div className="flex flex-wrap gap-2">
                                {user.servicesOffered.map((service) => (
                                  <Badge key={service} variant="default">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            {user.contactEmail && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <a href={`mailto:${user.contactEmail}`} className="text-sm hover:underline">
                                  {user.contactEmail}
                                </a>
                              </div>
                            )}
                            {user.contactNumber && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{user.contactNumber}</span>
                              </div>
                            )}
                            {user.companyWebsite && (
                              <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <a
                                  href={user.companyWebsite}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm hover:underline"
                                >
                                  {user.companyWebsite}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Portfolio Preview */}
                  {user.portfolio?.length && (
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Portfolio</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {user.portfolio.slice(0, 4).map((image, index) => (
                            <img
                              key={index}
                              src={image || "/placeholder.svg"}
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                        {user.portfolio.length > 4 && (
                          <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                            View All ({user.portfolio.length})
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              {user.portfolio?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.portfolio.map((image, index) => (
                    <Card key={index}>
                      <CardContent className="p-0">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No portfolio items to display.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectsTab userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
