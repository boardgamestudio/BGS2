"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

interface SignUpFormData {
  displayName: string
  email: string
}

export function AuthForms({ onSuccess }: { onSuccess?: () => void }) {
  const [isSignUp, setIsSignUp] = useState(true)

  return (
    <div className="w-full">
      {isSignUp ? (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-space-grotesk font-bold">Join Board Game Studio</h2>
            <p className="text-muted-foreground mt-2">Create your account to get started</p>
          </div>
          <SignUpFormContent onSuccess={onSuccess} />
          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Already have an account? </span>
            <Button variant="link" className="p-0 h-auto" onClick={() => setIsSignUp(false)}>
              Sign in
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-space-grotesk font-bold">Welcome Back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your Board Game Studio account</p>
          </div>
          <SignInFormContent onSuccess={onSuccess} />
          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button variant="link" className="p-0 h-auto" onClick={() => setIsSignUp(true)}>
              Sign up
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function SignUpFormContent({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState<SignUpFormData>({
    displayName: "",
    email: "",
  })
  const { register } = useAuth()
  const router = useRouter()

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
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

    register(newUser)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="displayName">Display Name *</Label>
        <Input
          id="displayName"
          value={formData.displayName}
          onChange={(e) => handleInputChange("displayName", e.target.value)}
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
          onChange={(e) => handleInputChange("email", e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Create Account
      </Button>
    </form>
  )
}

function SignInFormContent({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("[v0] Attempting sign in for:", email)

    const success = login(email, password)

    if (success) {
      console.log("[v0] Sign in successful")
      onSuccess?.()
    } else {
      console.log("[v0] Sign in failed - user not found")
      setError("Invalid email or password. Please check your credentials or sign up for a new account.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
      <div className="text-center">
        <Button variant="outline" className="w-full bg-transparent">
          Continue with Google
        </Button>
      </div>
    </form>
  )
}
