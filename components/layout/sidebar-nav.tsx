"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Briefcase, Calendar, UsersRound, BookOpen, ShoppingBag, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Jobs", href: "/jobs", icon: BookOpen },
  { name: "Events", href: "/events", icon: Calendar },
  { name: "Groups", href: "/groups", icon: UsersRound },
  { name: "Members", href: "/members", icon: Users },
  { name: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { name: "Resources", href: "/resources", icon: BookOpen },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  console.log("[v0] SidebarNav - pathname:", pathname)
  console.log("[v0] SidebarNav - user:", user)
  console.log("[v0] SidebarNav - user exists:", !!user)

  return (
    <nav className="fixed left-0 top-0 z-40 h-screen w-16 bg-card border-r border-border flex flex-col items-center py-4">
      {/* Logo */}
      <Link href="/" className="mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">BGS</span>
        </div>
      </Link>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
              title={item.name}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          )
        })}
      </div>

      {user && (
        <div className="mt-auto flex flex-col items-center space-y-2">
          <Link
            href="/profile"
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              pathname === "/profile" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
            title={`${user.displayName} - Profile`}
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={logout}
            className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      )}
    </nav>
  )
}
