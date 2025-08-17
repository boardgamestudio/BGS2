"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, X } from "lucide-react"
import type { CompanyProfile } from "@/types/user"

interface CompanyProfileFormProps {
  companyProfile?: CompanyProfile
  onSave?: (profile: Partial<CompanyProfile>) => void
  onCancel?: () => void
}

const availableServices = [
  "Game Design",
  "Illustration",
  "Graphic Design",
  "Manufacturing",
  "Publishing",
  "Marketing",
  "Playtesting",
  "Rulebook Writing",
  "Component Design",
  "Packaging Design",
  "Distribution",
  "Crowdfunding",
]

export function CompanyProfileForm({ companyProfile, onSave, onCancel }: CompanyProfileFormProps) {
  const [formData, setFormData] = useState({
    companyName: companyProfile?.companyName || "",
    description: companyProfile?.description || "",
    website: companyProfile?.website || "",
    address: {
      city: companyProfile?.address.city || "",
      state: companyProfile?.address.state || "",
      country: companyProfile?.address.country || "",
    },
    services: companyProfile?.services || [],
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave?.(formData)
  }

  const getCompanyInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-space-grotesk">
            {companyProfile ? "Edit Company Profile" : "Create Company Profile"}
          </CardTitle>
          <CardDescription>
            {companyProfile
              ? "Update your company information and services"
              : "Create a company profile to be listed in our service directory"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Logo */}
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={companyProfile?.logo || "/placeholder.svg"} alt={formData.companyName} />
                <AvatarFallback className="text-xl font-bold bg-secondary text-secondary-foreground">
                  {formData.companyName ? getCompanyInitials(formData.companyName) : "CO"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>

            {/* Basic Company Info */}
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Company Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your company and what makes you unique..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>

            {/* Address */}
            <div>
              <Label className="text-base font-semibold">Address</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="city" className="text-sm">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm">
                    State/Province
                  </Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange("address.state", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="text-sm">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange("address.country", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <Label className="text-base font-semibold">Services Offered</Label>
              <p className="text-sm text-muted-foreground mb-3">Select all services your company provides</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableServices.map((service) => (
                  <div
                    key={service}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.services.includes(service)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{service}</span>
                      {formData.services.includes(service) && <X className="w-4 h-4" />}
                    </div>
                  </div>
                ))}
              </div>
              {formData.services.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground mb-2">Selected services:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{companyProfile ? "Update Profile" : "Create Profile"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
