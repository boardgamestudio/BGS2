"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppHeader } from "@/components/layout/app-header"
import { CreateGroupForm } from "@/components/groups/create-group-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreateGroupPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Create Group</h1>
          <p className="text-muted-foreground mb-8">Build a community around your interests</p>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">You need to be signed in to create groups.</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (groupData: any) => {
    setIsSubmitting(true)
    try {
      const groupWithMetadata = {
        ...groupData,
        id: Date.now().toString(),
        creatorId: user.id,
        creatorName: user.displayName || `${user.firstName} ${user.lastName}`,
        creatorUsername: user.username || user.id,
        memberCount: 1, // Creator is first member
        members: [user.id],
        createdAt: new Date(),
        lastActivity: new Date(),
        isPublic: groupData.type === "public",
        maxMembers: groupData.maxMembers ? Number.parseInt(groupData.maxMembers) : null,
      }

      // Save to localStorage
      const existingGroups = JSON.parse(localStorage.getItem("bgs_groups") || "[]")
      const updatedGroups = [...existingGroups, groupWithMetadata]
      localStorage.setItem("bgs_groups", JSON.stringify(updatedGroups))

      console.log("[v0] Group created and saved to localStorage:", groupWithMetadata)

      // Simulate brief loading
      await new Promise((resolve) => setTimeout(resolve, 500))

      router.push("/groups")
    } catch (error) {
      console.error("Error creating group:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push("/groups")
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Create Group</h1>
        <p className="text-muted-foreground mb-8">Build a community around your board game interests</p>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CreateGroupForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
