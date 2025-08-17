"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppHeader } from "@/components/layout/app-header"
import { Search, Plus, Users, MapPin, Lock } from "lucide-react"
import Link from "next/link"

interface Group {
  id: string
  name: string
  description: string
  category: string
  type: string
  memberCount: number
  isPublic: boolean
  tags: string[]
  location?: string
  createdAt: Date
  lastActivity: Date
  creatorId?: string
  members?: string[]
}

function GroupCard({ group }: { group: Group }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{group.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {group.category}
              </Badge>
              {group.type === "private" && <Lock className="w-3 h-3 text-muted-foreground" />}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {group.memberCount}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{group.description}</p>
        {group.location && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3" />
            {group.location}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {group.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <Button size="sm" variant="outline">
            {group.type === "private" ? "Request" : "Join"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function GroupsPage() {
  const { user } = useAuth()
  const [groups, setGroups] = useState<Group[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  useEffect(() => {
    const loadGroups = () => {
      const savedGroups = localStorage.getItem("bgs_groups")
      if (savedGroups) {
        try {
          const parsedGroups = JSON.parse(savedGroups)
          setGroups(parsedGroups)
          console.log("[v0] Loaded groups from localStorage:", parsedGroups.length)
        } catch (error) {
          console.error("[v0] Error parsing groups from localStorage:", error)
          setGroups([])
        }
      } else {
        setGroups([])
      }
    }

    loadGroups()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bgs_groups") {
        loadGroups()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const publicGroups = groups.filter((group) => group.isPublic)
  const myGroups = groups.filter((group) => user && (group.creatorId === user.id || group.members?.includes(user.id)))

  const filteredGroups = publicGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || group.category === selectedCategory
    const matchesType = selectedType === "all" || group.type === selectedType

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Community Groups"
        subtitle="Connect with like-minded creators and collaborate on board game projects"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Community Groups</h2>
            <p className="text-muted-foreground">
              Connect with like-minded creators, share knowledge, and collaborate on board game projects
            </p>
          </div>
          <Link href="/groups/create">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </Link>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search groups..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="design">Game Design</SelectItem>
                    <SelectItem value="art">Art & Illustration</SelectItem>
                    <SelectItem value="publishing">Publishing</SelectItem>
                    <SelectItem value="local">Local Communities</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="invite-only">Invite Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Discover ({filteredGroups.length})
            </TabsTrigger>
            <TabsTrigger value="my-groups">My Groups ({myGroups.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">{filteredGroups.length} groups found</p>
              <Select defaultValue="members">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="members">Most Members</SelectItem>
                  <SelectItem value="activity">Most Active</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => <GroupCard key={group.id} group={group} />)
              ) : (
                <div className="col-span-full">
                  <Card className="p-8 text-center">
                    <CardContent>
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No groups created yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Be the first to create a community group for board game creators.
                      </p>
                      <Link href="/groups/create">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Create the First Group
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="my-groups" className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">{myGroups.length} groups you're a member of</p>
              <Link href="/groups/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Group
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGroups.length > 0 ? (
                myGroups.map((group) => <GroupCard key={group.id} group={group} />)
              ) : (
                <div className="col-span-full">
                  <Card className="p-8 text-center">
                    <CardContent>
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">You haven't joined any groups yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Join or create groups to connect with other board game creators.
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={() => document.querySelector('[value="discover"]')?.click()}>
                          Browse Groups
                        </Button>
                        <Link href="/groups/create">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Group
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
