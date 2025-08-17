"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, User, Camera, FileText } from "lucide-react"
import { useState } from "react"

interface ProfileCompletionBannerProps {
  completeness: number
  onDismiss?: () => void
}

export function ProfileCompletionBanner({ completeness, onDismiss }: ProfileCompletionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed || completeness >= 80) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  const steps = [
    { icon: User, label: "Complete basic info", completed: completeness > 30 },
    { icon: Camera, label: "Add profile photo", completed: completeness > 50 },
    { icon: FileText, label: "Write bio & skills", completed: completeness > 70 },
  ]

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold">Complete your profile</h3>
              <span className="text-sm text-muted-foreground">({completeness}% complete)</span>
            </div>
            <Progress value={completeness} className="mb-3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <step.icon className={`w-4 h-4 ${step.completed ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={step.completed ? "text-primary" : "text-muted-foreground"}>{step.label}</span>
                </div>
              ))}
            </div>
            <Button size="sm">Complete Profile</Button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
