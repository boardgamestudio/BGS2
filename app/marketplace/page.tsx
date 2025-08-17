"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Globe, MapPin, Star, Users } from "lucide-react"
import Link from "next/link"
import { AppHeader } from "@/components/layout/app-header"

export default function MarketplacePage() {
  const { users } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFreelancers, setShowFreelancers] = useState(true)
  const [showServices, setShowServices] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")

  const marketplaceUsers = (users || []).filter(
    (user) =>
      (user.membershipTypes.includes("freelancer") || user.membershipTypes.includes("service")) &&
      user.showInMarketplace !== false,
  )

  const filteredUsers = marketplaceUsers.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.skills?.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.servicesOffered?.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesType =
      (showFreelancers && user.membershipTypes.includes("freelancer")) ||
      (showServices && user.membershipTypes.includes("service"))

    const matchesCategory =
      !selectedCategory ||
      user.skills?.some((skill) => skill.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      user.servicesOffered?.some((service) => service.toLowerCase().includes(selectedCategory.toLowerCase()))

    return matchesSearch && matchesType && matchesCategory
  })

  const categories = [
    "Artwork & Illustration",
    "Graphic Design",
    "Writing & Editing",
    "Game Design Consulting",
    "Photography",
    "Marketing & PR",
    "Playtesting",
    "Manufacturing",
  ]

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Creative Marketplace"
        subtitle="Connect with talented professionals to bring your board game vision to life"
        showUserInfo={false}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search for services, skills, or providers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="freelancers"
                      checked={showFreelancers}
                      onCheckedChange={(checked) => setShowFreelancers(checked as boolean)}
                    />
                    <label htmlFor="freelancers" className="text-sm font-medium cursor-pointer">
                      Freelancers
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="services"
                      checked={showServices}
                      onCheckedChange={(checked) => setShowServices(checked as boolean)}
                    />
                    <label htmlFor="services" className="text-sm font-medium cursor-pointer">
                      Services
                    </label>
                  </div>
                  {selectedCategory && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedCategory("")} className="text-xs">
                      Clear: {selectedCategory}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Providers */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Providers</h2>
                <Badge variant="secondary" className="text-sm">
                  {filteredUsers.length} results
                </Badge>
              </div>

              {filteredUsers.length === 0 ? (
                <Card className="p-8 text-center">
                  <CardContent>
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No providers found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filters to find more providers.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("")
                        setShowFreelancers(true)
                        setShowServices(true)
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-lg transition-all duration-200 hover:border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={user.profilePicture || "/placeholder.svg?height=64&width=64"}
                            alt={user.displayName}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <Link href={`/profile/${user.id}`}>
                                  <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">
                                    {user.membershipTypes.includes("service")
                                      ? user.companyName || user.displayName
                                      : user.displayName}
                                  </h3>
                                </Link>
                                {user.membershipTypes.includes("service") && (
                                  <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Service</Badge>
                                )}
                                {user.membershipTypes.includes("freelancer") && (
                                  <Badge className="bg-purple-500 hover:bg-purple-600 text-white">Freelancer</Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-medium">4.8</span>
                              </div>
                            </div>

                            {user.membershipTypes.includes("freelancer") && user.jobTitle && (
                              <p className="text-sm font-medium text-muted-foreground mb-2">{user.jobTitle}</p>
                            )}
                            {user.membershipTypes.includes("service") && user.companyStudio && (
                              <p className="text-sm font-medium text-muted-foreground mb-2">{user.companyStudio}</p>
                            )}

                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {user.city}, {user.country}
                              </span>
                            </div>

                            {user.membershipTypes.includes("freelancer") && user.professionalTagline && (
                              <p className="text-sm text-muted-foreground mb-3 italic">"{user.professionalTagline}"</p>
                            )}

                            {user.membershipTypes.includes("service") &&
                              user.servicesOffered &&
                              user.servicesOffered.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Services Offered:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {user.servicesOffered.slice(0, 4).map((service) => (
                                      <Badge
                                        key={service}
                                        variant="outline"
                                        className="text-xs bg-orange-50 border-orange-200"
                                      >
                                        {service}
                                      </Badge>
                                    ))}
                                    {user.servicesOffered.length > 4 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{user.servicesOffered.length - 4}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                            {user.membershipTypes.includes("freelancer") && user.skills && user.skills.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                  {user.skills.slice(0, 4).map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="outline"
                                      className="text-xs bg-purple-50 border-purple-200"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                  {user.skills.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{user.skills.length - 4}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {user.membershipTypes.includes("freelancer") &&
                              user.gameDesignFocus &&
                              user.gameDesignFocus.length > 0 && (
                                <div className="mb-3">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Game Design Focus:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {user.gameDesignFocus.slice(0, 3).map((focus) => (
                                      <Badge
                                        key={focus}
                                        variant="outline"
                                        className="text-xs bg-blue-50 border-blue-200"
                                      >
                                        {focus}
                                      </Badge>
                                    ))}
                                    {user.gameDesignFocus.length > 3 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{user.gameDesignFocus.length - 3}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              )}

                            {user.membershipTypes.includes("service") && user.companyDescription && (
                              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                {user.companyDescription}
                              </p>
                            )}

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {user.membershipTypes.includes("service") && user.companyWebsite && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={user.companyWebsite} target="_blank" rel="noopener noreferrer">
                                      <Globe className="w-4 h-4 mr-1" />
                                      <span className="text-xs">Website</span>
                                    </a>
                                  </Button>
                                )}
                                {user.membershipTypes.includes("freelancer") && user.socialLinks?.website && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer">
                                      <Globe className="w-4 h-4 mr-1" />
                                      <span className="text-xs">Portfolio</span>
                                    </a>
                                  </Button>
                                )}
                                {user.languages && user.languages.length > 0 && (
                                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                    <Globe className="w-4 h-4" />
                                    <span>{user.languages.slice(0, 2).join(", ")}</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex space-x-2">
                                <Link href={`/profile/${user.id}`}>
                                  <Button variant="outline" size="sm">
                                    View Profile
                                  </Button>
                                </Link>
                                {user.membershipTypes.includes("service") && user.contactEmail && (
                                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                                    Contact
                                  </Button>
                                )}
                                {user.membershipTypes.includes("freelancer") && (
                                  <Button size="sm" className="bg-purple-500 hover:bg-purple-600">
                                    Hire Now
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Browse by Category</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "secondary" : "ghost"}
                        className="w-full justify-start text-left h-auto p-3 hover:bg-muted transition-colors"
                        onClick={() => setSelectedCategory(selectedCategory === category ? "" : category)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm">{category}</span>
                          {selectedCategory === category && (
                            <Badge variant="outline" className="text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
