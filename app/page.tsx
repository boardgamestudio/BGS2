"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, Users, ArrowRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import { AppHeader } from "@/components/layout/app-header"

export default function HomePage() {
  const { user, register } = useAuth()
  const [showRegistration, setShowRegistration] = useState(false)
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
  })

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    const newUser = {
      displayName: formData.displayName,
      email: formData.email,
      membershipTypes: ["learner"] as const,
      paymentTier: "free" as const,
      showInMarketplace: true,
      // Set other required fields with defaults
      city: "",
      country: "",
      bio: "",
      profileVisibility: "public" as const,
      profilePicture: "",
      profileBanner: "",
      socialLinks: {
        website: "",
        twitter: "",
        discord: "",
        boardGameGeek: "",
        linkedin: "",
        facebook: "",
        instagram: "",
        youtube: "",
      },
      workExperience: [],
      education: [],
      portfolio: [],
      // Professional fields (empty by default)
      jobTitle: "",
      companyStudio: "",
      professionalTagline: "",
      gameDesignFocus: [],
      skills: [],
      languages: [],
      // Service fields (empty by default)
      companyName: "",
      companyLogo: "",
      companyDescription: "",
      servicesOffered: [],
      contactEmail: "",
      contactNumber: "",
      companyWebsite: "",
      companySocialLinks: {
        twitter: "",
        facebook: "",
        linkedin: "",
        instagram: "",
        youtube: "",
      },
      yearFounded: "",
      numberOfEmployees: "",
      gameTypeSpecialization: [],
    }

    const success = register(newUser)

    if (success) {
      setShowRegistration(false)
      setFormData({
        displayName: "",
        email: "",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader showCreateButton={false} />

      <div className="container mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Board Game Studio</h1>
        <p className="text-muted-foreground mb-8">Join the ultimate community for board game designers</p>
      </div>

      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">Join the Board Game Studio community</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="How you want to be known"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Create Account
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowRegistration(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto px-6 py-8 space-y-16">
        {/* Hero Section */}
        <section className="py-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-space-grotesk mb-8 leading-tight">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Join </span>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">the </span>
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
              Ultimate
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Community{" "}
            </span>
            <span className="text-white">for </span>
            <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">Board</span>
            <br />
            <span className="bg-gradient-to-r from-teal-400 to-green-500 bg-clip-text text-transparent">Game </span>
            <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
              Designers{" "}
            </span>
            <span className="text-white">and</span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Creatives
            </span>
          </h1>

          {!user && (
            <div className="mb-12">
              <Button onClick={() => setShowRegistration(true)} size="lg" className="bg-primary hover:bg-primary/90">
                Get Started - Join Now
              </Button>
            </div>
          )}

          {/* Membership Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 aspect-square flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">co</span>
                </div>
              </div>
              <div className="text-black font-bold text-lg mt-auto">Learner</div>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl p-8 aspect-square flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">co</span>
                </div>
              </div>
              <div className="text-white font-bold text-lg mt-auto">Designer</div>
            </div>
            <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl p-8 aspect-square flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">co</span>
                </div>
              </div>
              <div className="text-white font-bold text-lg mt-auto">Freelancer</div>
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl p-8 aspect-square flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">co</span>
                </div>
              </div>
              <div className="text-white font-bold text-lg mt-auto">Service</div>
            </div>
          </div>
        </section>

        {/* Latest Board Game Jobs */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Board Game Jobs</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Art for Deckbuilder", company: "Indie Studio", type: "Freelance", badge: "Remote" },
              { title: "Box art", company: "Big Games Co", type: "Contract", badge: "Remote" },
              { title: "Rulebook layout", company: "Creative Games", type: "Part-time", badge: "Contract" },
            ].map((job, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="bg-pink-500 text-white">
                      {job.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{job.title}</CardTitle>
                  <div className="h-24 bg-gray-900 rounded-lg"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Elevate Your Game Section */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Elevate Your Game
                <br />
                and Connect
                <br />
                with Like-Minded
                <br />
                Designers
              </h2>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">Join Now</Button>
            </div>
            <div className="relative">
              <div className="w-64 h-64 mx-auto relative">
                <div className="absolute inset-0 bg-yellow-400 rounded-full flex items-center justify-center">
                  <div className="text-black font-bold text-lg">Board Game Studio</div>
                </div>
                <div className="absolute -top-8 -left-8 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute -top-4 -right-12 w-24 h-24 bg-white rounded-full"></div>
                <div className="absolute -bottom-8 -left-12 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute -bottom-4 -right-8 w-12 h-12 bg-white rounded-full"></div>
                <div className="absolute top-1/2 -right-16 w-8 h-8 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "ROME: BGG BI-Monthly July Jam", date: "July 15", attendees: 24 },
              { title: "Ascension Legends on GameFound", date: "July 22", attendees: 156 },
            ].map((event, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                  <div className="h-32 bg-gray-900 rounded-lg mb-4"></div>
                  <CardDescription className="flex items-center gap-4 text-gray-400">
                    <span className="flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {event.date}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees} attending
                    </span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Access to Resources */}
        <section className="py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-800 rounded-2xl p-8 h-64"></div>
            <div>
              <div className="text-sm text-gray-400 mb-2">Member Benefits</div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Access to 1000+
                <br />
                Game Design
                <br />
                Resources
              </h2>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white">Browse Now</Button>
            </div>
          </div>
        </section>

        {/* Member Projects */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Member Projects</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Coffee Cup", creator: "Alex", category: "Card Game" },
              { title: "T-Shirt", creator: "Sarah", category: "Merchandise" },
              { title: "Fashion Bag", creator: "Mike", category: "Accessories" },
            ].map((project, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-secondary/50 transition-colors">
                <div className="aspect-square bg-gray-900 rounded-t-lg"></div>
                <CardHeader>
                  <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                  <CardDescription className="flex items-center justify-between text-gray-400">
                    <span>by {project.creator}</span>
                    <Badge variant="outline" className="text-pink-400 border-pink-400">
                      {project.category}
                    </Badge>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Latest News */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Latest News</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "The Ultimate Guide to the Best WordPress LMS Plugins",
                excerpt: "Discover the top WordPress LMS plugins to create engaging online courses...",
                image: "/placeholder.svg?height=200&width=400",
              },
              {
                title: "Building an Online Portfolio to Impress Clients",
                excerpt: "Learn how to build an impressive online portfolio that showcases your work...",
                image: "/placeholder.svg?height=200&width=400",
              },
            ].map((article, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-primary/50 transition-colors">
                <div className="h-48 bg-gray-900 rounded-t-lg"></div>
                <CardHeader>
                  <CardTitle className="text-white text-lg leading-tight">{article.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">{article.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
