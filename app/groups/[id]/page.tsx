import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  MessageSquare,
  Calendar,
  Share2,
  Heart,
  Pin,
  MoreHorizontal,
  Send,
  Lock,
  Eye,
  UserPlus,
} from "lucide-react"
import Link from "next/link"
import type { Group, GroupPost } from "@/types/group"
import { getGroupCategoryColor, getGroupTypeLabel, formatMemberCount } from "@/lib/group-utils"

// Mock group data - in real app, this would be fetched based on the ID
const mockGroup: Group = {
  id: "1",
  name: "Strategy Game Designers",
  description: `A vibrant community for designers creating strategic board games. Whether you're working on your first prototype or you're a seasoned designer, this is the place to:

• Share game mechanics and get expert feedback
• Collaborate on complex game systems and balance
• Find playtesting partners and organize sessions  
• Discuss the latest trends in strategy game design
• Network with publishers and other professionals

We welcome designers of all experience levels who are passionate about creating engaging strategic experiences. Our community values constructive feedback, respectful discussion, and collaborative learning.

Join us to elevate your game design skills and connect with fellow strategy game enthusiasts!`,
  category: "design",
  type: "public",
  coverImage: "/strategy-game-design.png",
  avatar: "/placeholder.svg?height=80&width=80",
  memberCount: 1247,
  maxMembers: 2000,
  isPublic: true,
  requiresApproval: false,
  tags: ["Strategy", "Mechanics", "Playtesting", "Game Balance", "Design Theory"],
  creatorId: "1",
  creatorName: "Alex Chen",
  creatorUsername: "alexchen",
  admins: [
    {
      userId: "1",
      username: "alexchen",
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "admin",
      joinedAt: new Date("2024-01-15"),
    },
  ],
  moderators: [
    {
      userId: "2",
      username: "sarahj",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "moderator",
      joinedAt: new Date("2024-01-20"),
    },
  ],
  members: [
    {
      userId: "3",
      username: "mikero",
      name: "Mike Rodriguez",
      role: "member",
      joinedAt: new Date("2024-02-01"),
    },
    {
      userId: "4",
      username: "emmaw",
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      role: "member",
      joinedAt: new Date("2024-02-15"),
    },
  ],
  pendingRequests: [],
  rules: [
    "Be respectful and constructive in all interactions",
    "No spam or excessive self-promotion without context",
    "Share detailed feedback when critiquing designs",
    "Use appropriate tags when posting content",
    "Keep discussions focused on strategy game design",
  ],
  location: "Global",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-03-10"),
  lastActivity: new Date("2024-03-10T14:30:00"),
}

// Mock posts data
const mockPosts: GroupPost[] = [
  {
    id: "1",
    groupId: "1",
    authorId: "2",
    authorName: "Sarah Johnson",
    authorUsername: "sarahj",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    title: "New Worker Placement Mechanic - Feedback Needed",
    content: `I've been working on a new worker placement mechanic where workers gain experience over time and become more efficient at certain tasks. 

The core idea is that each worker starts as a "novice" and can specialize in different areas (resource gathering, building, trading) based on where you place them. After 3 uses in the same area, they become "experienced" and provide bonus effects.

Has anyone seen something similar? I want to make sure I'm not reinventing the wheel. Also looking for thoughts on potential balance issues - should experienced workers be permanent or reset each round?

Would love to get some playtesting feedback if anyone's interested!`,
    type: "question",
    attachments: [],
    likes: ["3", "4", "5"],
    likeCount: 12,
    commentCount: 8,
    isPinned: false,
    createdAt: new Date("2024-03-10T10:30:00"),
    updatedAt: new Date("2024-03-10T10:30:00"),
  },
  {
    id: "2",
    groupId: "1",
    authorId: "1",
    authorName: "Alex Chen",
    authorUsername: "alexchen",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    title: "Monthly Design Challenge: Area Control",
    content: `🎯 March Design Challenge is here!

This month's theme: **Area Control with a Twist**

Your challenge is to design a unique area control mechanic that goes beyond traditional "most pieces wins the area" gameplay. Think about:

• Alternative ways to measure control (influence, connections, etc.)
• Dynamic control that changes over time
• Asymmetric control conditions for different players
• Combining area control with other mechanics

**Rules:**
- Post your mechanic description by March 25th
- Include a brief example of how it works
- Tag your post with #DesignChallenge
- Winner gets featured in our newsletter!

Looking forward to seeing your creative solutions! 🎲`,
    type: "announcement",
    attachments: [],
    likes: ["2", "3", "4", "5", "6"],
    likeCount: 24,
    commentCount: 15,
    isPinned: true,
    createdAt: new Date("2024-03-08T09:00:00"),
    updatedAt: new Date("2024-03-08T09:00:00"),
  },
]

export default function GroupDetailPage() {
  const typeIcon = {
    public: <Eye className="w-4 h-4" />,
    private: <Lock className="w-4 h-4" />,
    "invite-only": <UserPlus className="w-4 h-4" />,
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
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                Projects
              </Link>
              <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
                Jobs
              </Link>
              <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                Events
              </Link>
              <Link href="/groups" className="text-muted-foreground hover:text-foreground transition-colors">
                Groups
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
              <Button size="sm">Join Now</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/groups" className="hover:text-foreground">
            Groups
          </Link>
          <span>/</span>
          <span>{mockGroup.name}</span>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Group Header */}
            <div>
              {mockGroup.coverImage && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                  <img
                    src={mockGroup.coverImage || "/placeholder.svg"}
                    alt={mockGroup.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={mockGroup.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{mockGroup.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className={`${getGroupCategoryColor(mockGroup.category)} text-white border-0`}
                    >
                      {mockGroup.category}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {typeIcon[mockGroup.type]}
                      {getGroupTypeLabel(mockGroup.type)}
                    </Badge>
                  </div>
                  <h1 className="text-3xl font-bold font-space-grotesk mb-2">{mockGroup.name}</h1>
                  <p className="text-muted-foreground">
                    {formatMemberCount(mockGroup.memberCount)} members
                    {mockGroup.location && ` • ${mockGroup.location}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mockGroup.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Join Button */}
              <div className="flex items-center gap-3 mb-6">
                <Button size="lg">Join Group</Button>
                <Button variant="outline" size="lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Follow
                </Button>
              </div>
            </div>

            {/* Group Content Tabs */}
            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-6">
                {/* New Post */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-3">
                        <Textarea placeholder="Share something with the group..." rows={3} />
                        <div className="flex items-center justify-between">
                          <Select defaultValue="discussion">
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="discussion">💬 Discussion</SelectItem>
                              <SelectItem value="question">❓ Question</SelectItem>
                              <SelectItem value="showcase">🎨 Showcase</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button>
                            <Send className="w-4 h-4 mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts List */}
                <div className="space-y-6">
                  {mockPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{post.authorName}</span>
                                <span className="text-sm text-muted-foreground">@{post.authorUsername}</span>
                                <span className="text-sm text-muted-foreground">•</span>
                                <span className="text-sm text-muted-foreground">
                                  {post.createdAt.toLocaleDateString()}
                                </span>
                                {post.isPinned && (
                                  <>
                                    <span className="text-sm text-muted-foreground">•</span>
                                    <Pin className="w-4 h-4 text-primary" />
                                    <span className="text-sm text-primary">Pinned</span>
                                  </>
                                )}
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>

                            {post.title && <h3 className="font-semibold text-lg mb-2">{post.title}</h3>}

                            <div className="prose prose-sm max-w-none mb-4">
                              {post.content.split("\n").map((paragraph, index) => (
                                <p key={index} className="mb-2 last:mb-0">
                                  {paragraph}
                                </p>
                              ))}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <button className="flex items-center gap-1 hover:text-foreground">
                                <Heart className="w-4 h-4" />
                                {post.likeCount}
                              </button>
                              <button className="flex items-center gap-1 hover:text-foreground">
                                <MessageSquare className="w-4 h-4" />
                                {post.commentCount}
                              </button>
                              <button className="flex items-center gap-1 hover:text-foreground">
                                <Share2 className="w-4 h-4" />
                                Share
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Group</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      {mockGroup.description.split("\n").map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {mockGroup.rules && mockGroup.rules.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Group Rules</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockGroup.rules.map((rule, index) => (
                          <div key={index} className="flex gap-3">
                            <span className="font-medium text-muted-foreground">{index + 1}.</span>
                            <span>{rule}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Admins</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mockGroup.admins.map((admin) => (
                        <div key={admin.userId} className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={admin.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{admin.name}</p>
                            <p className="text-xs text-muted-foreground">@{admin.username}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Moderators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mockGroup.moderators.map((mod) => (
                        <div key={mod.userId} className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={mod.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{mod.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{mod.name}</p>
                            <p className="text-xs text-muted-foreground">@{mod.username}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mockGroup.members.slice(0, 6).map((member) => (
                        <div key={member.userId} className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">@{member.username}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All Members
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No upcoming events</h3>
                      <p className="text-muted-foreground mb-4">This group hasn't scheduled any events yet.</p>
                      <Button>Create Event</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Group Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Group Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-medium">{formatMemberCount(mockGroup.memberCount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">{mockGroup.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{getGroupTypeLabel(mockGroup.type)}</span>
                </div>
                {mockGroup.location && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{mockGroup.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Sarah posted in discussions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Mike joined the group</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Alex pinned an announcement</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suggested Groups */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>CG</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Cooperative Games</p>
                      <p className="text-xs text-muted-foreground">678 members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>PT</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Playtesting Hub</p>
                      <p className="text-xs text-muted-foreground">432 members</p>
                    </div>
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
