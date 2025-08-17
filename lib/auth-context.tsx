"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"
import type { User } from "@/types/user"
import { useLocalStorage } from "./use-local-storage"

interface AuthContextType {
  user: User | null
  users: User[]
  login: (email: string, password: string) => boolean
  register: (userData: Omit<User, "id" | "createdAt" | "updatedAt">) => boolean
  logout: () => void
  switchUser: (userId: string) => void
  updateUser: (updatedData: Partial<User>) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [users, setUsers] = useLocalStorage<User[]>("bgs_users", [])
  const [currentUserId, setCurrentUserId] = useLocalStorage<string | null>("bgs_current_user_id", null)

  const currentUser = useMemo(() => {
    if (!currentUserId) return null
    return users.find((u) => u.id === currentUserId) || null
  }, [users, currentUserId])

  useEffect(() => {
    setUser(currentUser)
    setIsLoading(false)
  }, [currentUser])

  const register = useCallback(
    (userData: Omit<User, "id" | "createdAt" | "updatedAt">): boolean => {
      try {
        const nextId = (users.length + 1).toString()

        const newUser: User = {
          ...userData,
          id: nextId,
          createdAt: new Date(),
          updatedAt: new Date(),
          showInMarketplace: userData.showInMarketplace ?? true,
          membershipTypes: userData.membershipTypes || ["learner"],
          paymentTier: userData.paymentTier || "free",
          portfolioImages: userData.portfolio || [],
          workExperience: userData.workExperience || [],
          education: userData.education || [],
        }

        setUsers((prev) => [...prev, newUser])
        setUser(newUser)
        setCurrentUserId(newUser.id)

        console.log("[v0] User registered successfully:", newUser.displayName, "ID:", newUser.id)
        return true
      } catch (error) {
        console.error("[v0] Registration failed:", error)
        return false
      }
    },
    [users, setUsers, setCurrentUserId],
  )

  const login = useCallback(
    (email: string, password: string): boolean => {
      const foundUser = users.find((u: User) => u.email === email)
      if (foundUser) {
        setUser(foundUser)
        setCurrentUserId(foundUser.id)
        console.log("[v0] User logged in:", foundUser.displayName, "ID:", foundUser.id)
        return true
      }
      return false
    },
    [users, setCurrentUserId],
  )

  const logout = useCallback(() => {
    setUser(null)
    setCurrentUserId(null)
    console.log("[v0] User logged out")
  }, [setCurrentUserId])

  const switchUser = useCallback(
    (userId: string) => {
      const foundUser = users.find((u: User) => u.id === userId)
      if (foundUser) {
        setUser(foundUser)
        setCurrentUserId(foundUser.id)
      }
    },
    [users, setCurrentUserId],
  )

  const updateUser = useCallback(
    async (updatedData: Partial<User>): Promise<void> => {
      if (!user) return

      const updatedUser = { ...user, ...updatedData, updatedAt: new Date() }

      setUsers((prev) => prev.map((u) => (u.id === user.id ? updatedUser : u)))
      setUser(updatedUser)
      console.log("[v0] User updated:", updatedUser.displayName)
    },
    [user, setUsers],
  )

  const contextValue = useMemo(
    () => ({
      user,
      users,
      login,
      register,
      logout,
      switchUser,
      updateUser,
      isLoading,
    }),
    [user, users, login, register, logout, switchUser, updateUser, isLoading],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
