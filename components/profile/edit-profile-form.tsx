"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Plus, X } from "lucide-react"
import type { User } from "@/types/user"
import { getUserCapabilities, getMemberTypeDisplayName } from "@/lib/user-capabilities"
import { useAuth } from "@/lib/auth-context"

interface EditProfileFormProps {
  user: User
  onSave?: (updatedUser: Partial<User>) => void
  onCancel?: () => void
  onClose?: () => void
}

export function EditProfileForm({ user, onSave, onCancel, onClose }: EditProfileFormProps) {
  const { updateUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    // Personal fields
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    displayName: user.displayName || user.username,
    bio: user.bio || "",
    city: user.city || "",
    country: user.country || "",
    mobile: user.mobile || "",
    isPublic: user.isPublic ?? true,
    showInMarketplace: user.showInMarketplace || false,
    socialLinks: {
      website: user.socialLinks?.website || "",
      twitter: user.socialLinks?.twitter || "",
      instagram: user.socialLinks?.instagram || "",
      linkedin: user.socialLinks?.linkedin || "",
      discord: user.socialLinks?.discord || "",
      facebook: user.socialLinks?.facebook || "",
      youtube: user.socialLinks?.youtube || "",
      bgg: user.socialLinks?.bgg || "",
    },
    // Professional fields
    jobTitle: user.jobTitle || "",
    companyStudio: user.companyStudio || "",
    professionalTagline: user.professionalTagline || "",
    gameDesignFocus: user.gameDesignFocus || [],
    skills: user.skills || [],
    languages: user.languages || [],
    workExperience:
      user.workExperience?.map((exp, index) => ({
        id: index.toString(),
        company: exp.company || "",
        position: exp.position || "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: exp.current || false,
        description: exp.description || "",
      })) || [],
    education:
      user.education?.map((edu, index) => ({
        id: index.toString(),
        institution: edu.institution || "",
        degree: edu.degree || "",
        fieldOfStudy: edu.fieldOfStudy || "",
        graduationYear: edu.graduationYear || "",
      })) || [],
    portfolioImages:
      user.portfolioImages?.map((url, index) => ({
        id: index.toString(),
        url,
        title: "",
        description: "",
        uploadedAt: new Date(),
      })) || [],
    // Service fields
    companyLogo: user.companyLogo || "",
    companyDescription: user.companyDescription || "",
    servicesOffered: user.servicesOffered || [],
    contactEmail: user.contactEmail || "",
    contactNumber: user.contactNumber || "",
    companyWebsite: user.companyWebsite || "",
    companySocialLinks: {
      twitter: user.companySocialLinks?.twitter || "",
      facebook: user.companySocialLinks?.facebook || "",
      linkedin: user.companySocialLinks?.linkedin || "",
      instagram: user.companySocialLinks?.instagram || "",
      youtube: user.companySocialLinks?.youtube || "",
    },
    yearFounded: user.yearFounded || "",
    numberOfEmployees: user.numberOfEmployees || "",
    gameTypeSpecialization: user.gameTypeSpecialization || [],
  })

  const primaryMemberType = user.membershipTypes[0] || "learner"
  const capabilities = getUserCapabilities(primaryMemberType as any)

  const safeCapabilities = {
    maxProjects: capabilities?.maxProjects || 1,
    maxPortfolioImages: capabilities?.maxPortfolioImages || 5,
    canCreateEvents: capabilities?.canCreateEvents || false,
    canCreateJobs: capabilities?.canCreateJobs || false,
    canCreateGroups: capabilities?.canCreateGroups || false,
    canCreateResources: capabilities?.canCreateResources || false,
    hasProfessionalFields:
      user.membershipTypes.includes("freelancer") ||
      user.membershipTypes.includes("designer") ||
      user.membershipTypes.includes("service") ||
      false,
    hasServiceFields: user.membershipTypes.includes("service") || false,
  }

  const [activeTab, setActiveTab] = useState("personal")

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    if (field.startsWith("socialLinks.")) {
      const socialField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value as string,
        },
      }))
    } else if (field.startsWith("companySocialLinks.")) {
      const socialField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        companySocialLinks: {
          ...prev.companySocialLinks,
          [socialField]: value as string,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const updatedUserData: Partial<User> = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        bio: formData.bio,
        city: formData.city,
        country: formData.country,
        mobile: formData.mobile,
        isPublic: formData.isPublic,
        showInMarketplace: formData.showInMarketplace,
        socialLinks: formData.socialLinks,
        jobTitle: formData.jobTitle,
        companyStudio: formData.companyStudio,
        professionalTagline: formData.professionalTagline,
        gameDesignFocus: formData.gameDesignFocus,
        skills: formData.skills,
        languages: formData.languages,
        workExperience: formData.workExperience,
        education: formData.education,
        portfolioImages: formData.portfolioImages.map((img) => img.url),
        // Service fields
        companyLogo: formData.companyLogo,
        companyDescription: formData.companyDescription,
        servicesOffered: formData.servicesOffered,
        contactEmail: formData.contactEmail,
        contactNumber: formData.contactNumber,
        companyWebsite: formData.companyWebsite,
        companySocialLinks: formData.companySocialLinks,
        yearFounded: formData.yearFounded,
        numberOfEmployees: formData.numberOfEmployees,
        gameTypeSpecialization: formData.gameTypeSpecialization,
        updatedAt: new Date(),
      }

      // Update user in auth context (persists to localStorage)
      await updateUser(updatedUserData)

      // Call optional callbacks
      onSave?.(updatedUserData)

      // Close form after short delay
      setTimeout(() => {
        onClose?.()
      }, 500)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const skillOptions = [
    "Game Design",
    "Graphic Design",
    "Illustration",
    "3D Modeling",
    "Writing",
    "Editing",
    "Playtesting",
    "Project Management",
    "Marketing",
    "Social Media",
    "Photography",
    "Video Production",
    "Audio Production",
    "Programming",
    "Web Development",
    "UI/UX Design",
    "Animation",
    "Publishing",
    "Manufacturing",
  ]

  const gameDesignFocusOptions = [
    "Strategy Games",
    "Balancing",
    "Playtesting Coordination",
    "Mechanics Development",
    "Economic Systems",
    "Narrative Design",
    "World Building",
    "Component Design",
    "Social Deduction",
    "Thematic Games",
    "Abstract Games",
    "Cooperative Games",
    "Dice Games",
    "Card Games",
    "Worker Placement",
    "Area Control",
    "Hidden Role",
  ]

  const languageOptions = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Russian",
    "Dutch",
    "Polish",
    "Swedish",
    "Norwegian",
    "Danish",
  ]

  const serviceOptions = [
    "Artwork & Illustration",
    "Graphic Design",
    "Writing & Editing",
    "Game Design Consulting",
    "Photography",
    "Marketing & PR",
    "Project Management",
    "Translation",
    "Manufacturing",
    "Distribution",
    "Legal Services",
    "Accounting",
  ]

  const gameTypeOptions = [
    "Strategy Games",
    "Party Games",
    "Family Games",
    "Educational Games",
    "Card Games",
    "Dice Games",
    "Cooperative Games",
    "Abstract Games",
    "Thematic Games",
    "RPG Games",
    "Social Deduction",
    "Worker Placement",
    "Area Control",
    "Hidden Role",
  ]

  const handleAddWorkExperience = () => {
    const newExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setFormData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience],
    }))
  }

  const handleRemoveWorkExperience = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }))
  }

  const handleUpdateWorkExperience = (id: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const handleAddEducation = () => {
    const newEducation = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      graduationYear: "",
    }
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }))
  }

  const handleRemoveEducation = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }))
  }

  const handleUpdateEducation = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    }))
  }

  const handleMembershipUpgrade = () => {
    // Simple upgrade simulation - in real app this would integrate with payment system
    const currentTypes = user.membershipTypes || ["learner"]
    let newMembershipTypes = [...currentTypes]
    let newPaymentTier = user.paymentTier || "free"

    // Upgrade logic based on current membership
    if (currentTypes.includes("learner") && !currentTypes.includes("freelancer")) {
      // Upgrade learner to freelancer (still free tier)
      newMembershipTypes = ["freelancer"]
    } else if (currentTypes.includes("freelancer") && !currentTypes.includes("designer")) {
      // Upgrade to designer (paid tier 1)
      newMembershipTypes = ["designer", "freelancer"]
      newPaymentTier = "tier1"
    } else if (!currentTypes.includes("service")) {
      // Upgrade to service provider (paid tier 2)
      newMembershipTypes = ["service"]
      newPaymentTier = "tier2"
    }

    const updatedUser = {
      ...user,
      membershipTypes: newMembershipTypes,
      paymentTier: newPaymentTier,
    }

    updateUser(updatedUser)
    console.log("[v0] Membership upgraded:", { from: currentTypes, to: newMembershipTypes, tier: newPaymentTier })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">Edit Profile</CardTitle>
          <CardDescription>Update your profile information and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="professional" disabled={!safeCapabilities.hasProfessionalFields}>
                  Professional
                </TabsTrigger>
                <TabsTrigger value="service" disabled={!safeCapabilities.hasServiceFields}>
                  Service Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                {/* Membership Info */}
                <div>
                  <Label className="text-base font-semibold">Membership</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {user.membershipTypes.map((type) => (
                            <Badge key={type} variant="secondary">
                              {getMemberTypeDisplayName(type)}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Member since {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleMembershipUpgrade}>
                        Upgrade Membership
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user.paymentTier === "free"
                        ? "Upgrade to unlock additional features and higher limits"
                        : "Thank you for being a premium member!"}
                    </p>
                  </div>
                </div>

                {/* Profile Photo */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.displayName} />
                    <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                      {getInitials(formData.displayName || formData.firstName + " " + formData.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Banner
                    </Button>
                    <p className="text-xs text-muted-foreground">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="How you want to be shown publicly"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Privacy Settings */}
                <div className="space-y-4 p-4 border rounded-lg">
                  <Label className="text-base font-semibold">Privacy Settings</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isPublic">Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Public - Anyone can see your profile</p>
                    </div>
                    <Select
                      value={formData.isPublic ? "public" : "private"}
                      onValueChange={(value) => handleInputChange("isPublic", value === "public")}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {safeCapabilities.hasProfessionalFields && (
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showInMarketplace">Show in marketplace/services section</Label>
                      </div>
                      <Switch
                        id="showInMarketplace"
                        checked={formData.showInMarketplace}
                        onCheckedChange={(checked) => handleInputChange("showInMarketplace", checked)}
                      />
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div>
                  <Label className="text-base font-semibold">Social Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {Object.entries(formData.socialLinks).map(([platform, value]) => (
                      <div key={platform}>
                        <Label htmlFor={platform} className="text-sm capitalize">
                          {platform === "bgg" ? "BoardGameGeek" : platform}
                        </Label>
                        <Input
                          id={platform}
                          placeholder={`Your ${platform === "bgg" ? "BoardGameGeek" : platform} URL`}
                          value={value}
                          onChange={(e) => handleInputChange(`socialLinks.${platform}`, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyStudio">Company/Studio</Label>
                    <Input
                      id="companyStudio"
                      value={formData.companyStudio}
                      onChange={(e) => handleInputChange("companyStudio", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="professionalTagline">Professional Tagline</Label>
                  <Input
                    id="professionalTagline"
                    placeholder="Brief professional description"
                    value={formData.professionalTagline}
                    onChange={(e) => handleInputChange("professionalTagline", e.target.value)}
                  />
                </div>

                {/* Game Design Focus */}
                <div>
                  <Label className="text-base font-semibold">Game Design Focus</Label>
                  <p className="text-sm text-muted-foreground mb-2">Select areas of game design you focus on</p>
                  <div className="flex flex-wrap gap-2">
                    {gameDesignFocusOptions.map((focus) => (
                      <Badge
                        key={focus}
                        variant={formData.gameDesignFocus.includes(focus) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newFocus = formData.gameDesignFocus.includes(focus)
                            ? formData.gameDesignFocus.filter((f) => f !== focus)
                            : [...formData.gameDesignFocus, focus]
                          handleInputChange("gameDesignFocus", newFocus)
                        }}
                      >
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <Label className="text-base font-semibold">Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skillOptions.map((skill) => (
                      <Badge
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newSkills = formData.skills.includes(skill)
                            ? formData.skills.filter((s) => s !== skill)
                            : [...formData.skills, skill]
                          handleInputChange("skills", newSkills)
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <Label className="text-base font-semibold">Languages</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {languageOptions.map((language) => (
                      <Badge
                        key={language}
                        variant={formData.languages.includes(language) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newLanguages = formData.languages.includes(language)
                            ? formData.languages.filter((l) => l !== language)
                            : [...formData.languages, language]
                          handleInputChange("languages", newLanguages)
                        }}
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Portfolio */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Portfolio</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Placeholder for adding portfolio image logic
                      }}
                      disabled={formData.portfolioImages.length >= safeCapabilities.maxPortfolioImages}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Portfolio Image
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {formData.portfolioImages.length} / {safeCapabilities.maxPortfolioImages} images
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.portfolioImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={image.title || "Portfolio image"}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            // Placeholder for removing portfolio image logic
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Experience */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Work Experience</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddWorkExperience}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                  <div className="space-y-4 mt-4">
                    {formData.workExperience.map((experience, index) => (
                      <Card key={experience.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Experience #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveWorkExperience(experience.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`company-${experience.id}`}>Company</Label>
                            <Input
                              id={`company-${experience.id}`}
                              value={experience.company || ""}
                              onChange={(e) => handleUpdateWorkExperience(experience.id, "company", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`position-${experience.id}`}>Position</Label>
                            <Input
                              id={`position-${experience.id}`}
                              value={experience.position || ""}
                              onChange={(e) => handleUpdateWorkExperience(experience.id, "position", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor={`startDate-${experience.id}`}>Start Date</Label>
                            <Input
                              id={`startDate-${experience.id}`}
                              type="month"
                              value={experience.startDate || ""}
                              onChange={(e) => handleUpdateWorkExperience(experience.id, "startDate", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
                            <Input
                              id={`endDate-${experience.id}`}
                              type="month"
                              value={experience.endDate || ""}
                              onChange={(e) => handleUpdateWorkExperience(experience.id, "endDate", e.target.value)}
                              disabled={experience.current}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id={`current-${experience.id}`}
                              checked={experience.current}
                              onCheckedChange={(checked) =>
                                handleUpdateWorkExperience(experience.id, "current", checked as boolean)
                              }
                            />
                            <Label htmlFor={`current-${experience.id}`}>I currently work here</Label>
                          </div>
                          <Label htmlFor={`description-${experience.id}`}>Description</Label>
                          <Textarea
                            id={`description-${experience.id}`}
                            placeholder="Describe your role and responsibilities..."
                            value={experience.description || ""}
                            onChange={(e) => handleUpdateWorkExperience(experience.id, "description", e.target.value)}
                            rows={3}
                          />
                        </div>
                      </Card>
                    ))}
                    {formData.workExperience.length === 0 && (
                      <p className="text-sm text-muted-foreground">No work experience added yet.</p>
                    )}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Education</Label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddEducation}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                  <div className="space-y-4 mt-4">
                    {formData.education.map((education, index) => (
                      <Card key={education.id} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Education #{index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveEducation(education.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`institution-${education.id}`}>Institution</Label>
                            <Input
                              id={`institution-${education.id}`}
                              value={education.institution || ""}
                              onChange={(e) => handleUpdateEducation(education.id, "institution", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`degree-${education.id}`}>Degree</Label>
                            <Input
                              id={`degree-${education.id}`}
                              value={education.degree || ""}
                              onChange={(e) => handleUpdateEducation(education.id, "degree", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor={`fieldOfStudy-${education.id}`}>Field of Study</Label>
                            <Input
                              id={`fieldOfStudy-${education.id}`}
                              value={education.fieldOfStudy || ""}
                              onChange={(e) => handleUpdateEducation(education.id, "fieldOfStudy", e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`graduationYear-${education.id}`}>Graduation Year</Label>
                            <Input
                              id={`graduationYear-${education.id}`}
                              type="number"
                              min="1950"
                              max="2030"
                              value={education.graduationYear || ""}
                              onChange={(e) => handleUpdateEducation(education.id, "graduationYear", e.target.value)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                    {formData.education.length === 0 && (
                      <p className="text-sm text-muted-foreground">No education added yet.</p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="service" className="space-y-6">
                {/* Company Logo */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                    {formData.companyLogo ? (
                      <img
                        src={formData.companyLogo || "/placeholder.svg"}
                        alt="Company Logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">Square logo recommended</p>
                  </div>
                </div>

                {/* Company Description */}
                <div>
                  <Label htmlFor="companyDescription">Company Description *</Label>
                  <Textarea
                    id="companyDescription"
                    placeholder="Describe your company and services..."
                    value={formData.companyDescription}
                    onChange={(e) => handleInputChange("companyDescription", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Services Offered */}
                <div>
                  <Label className="text-base font-semibold">Services Offered *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {serviceOptions.map((service) => (
                      <Badge
                        key={service}
                        variant={formData.servicesOffered.includes(service) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newServices = formData.servicesOffered.includes(service)
                            ? formData.servicesOffered.filter((s) => s !== service)
                            : [...formData.servicesOffered, service]
                          handleInputChange("servicesOffered", newServices)
                        }}
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companyWebsite">Company Website *</Label>
                  <Input
                    id="companyWebsite"
                    placeholder="https://your-website.com"
                    value={formData.companyWebsite}
                    onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
                  />
                </div>

                {/* Company Social Links */}
                <div>
                  <Label className="text-base font-semibold">Company Social Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {Object.entries(formData.companySocialLinks).map(([platform, value]) => (
                      <div key={platform}>
                        <Label htmlFor={`company-${platform}`} className="text-sm capitalize">
                          {platform}
                        </Label>
                        <Input
                          id={`company-${platform}`}
                          placeholder={`Your company's ${platform} URL`}
                          value={value}
                          onChange={(e) => handleInputChange(`companySocialLinks.${platform}`, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearFounded">Year Founded</Label>
                    <Input
                      id="yearFounded"
                      placeholder="2020"
                      value={formData.yearFounded}
                      onChange={(e) => handleInputChange("yearFounded", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                    <Select
                      value={formData.numberOfEmployees}
                      onValueChange={(value) => handleInputChange("numberOfEmployees", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Just me</SelectItem>
                        <SelectItem value="2-10">2-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="200+">200+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Game Type Specialization */}
                <div>
                  <Label className="text-base font-semibold">Game Type Specialization</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {gameTypeOptions.map((gameType) => (
                      <Badge
                        key={gameType}
                        variant={formData.gameTypeSpecialization.includes(gameType) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const newTypes = formData.gameTypeSpecialization.includes(gameType)
                            ? formData.gameTypeSpecialization.filter((t) => t !== gameType)
                            : [...formData.gameTypeSpecialization, gameType]
                          handleInputChange("gameTypeSpecialization", newTypes)
                        }}
                      >
                        {gameType}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 active:from-primary/80 active:to-primary/70 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
